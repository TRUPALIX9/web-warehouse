// seed.ts - Populate MongoDB WMS with unique entries using faker
import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import Warehouse from "./src/app/api/models/Warehouse";
import Items from "./src/app/api/models/Items";
import Party from "./src/app/api/models/Party";
import PurchaseOrder from "./src/app/api/models/PurchaseOrder";
import Pallet from "./src/app/api/models/Pallet";

const MONGODB_URI =
  "mongodb+srv://projectUser:ConnectTrueDbProject@project-playground.nfrzo.mongodb.net/web-warehouse?retryWrites=true&w=majority";

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    await Promise.all([
      Warehouse.deleteMany(),
      Items.deleteMany(),
      Party.deleteMany(),
      PurchaseOrder.deleteMany(),
      Pallet.deleteMany(),
    ]);

    const parties = await Party.insertMany([
      ...Array.from({ length: 3 }, () => ({
        name: faker.company.name(),
        isVendor: true,
        contact_info: {
          phone: faker.phone.number(),
          email: faker.internet.email(),
        },
        address: {
          street: faker.location.streetAddress(),
          city: faker.location.city(),
          state: faker.location.state(),
          country: faker.location.country(),
          postal_code: faker.location.zipCode(),
        },
      })),
      ...Array.from({ length: 2 }, () => ({
        name: faker.company.name(),
        isVendor: false,
        contact_info: {
          phone: faker.phone.number(),
          email: faker.internet.email(),
        },
        address: {
          street: faker.location.streetAddress(),
          city: faker.location.city(),
          state: faker.location.state(),
          country: faker.location.country(),
          postal_code: faker.location.zipCode(),
        },
      })),
    ]);

    const units = Array.from({ length: 2 }, (_, u) => ({
      unit_id: faker.string.uuid(),
      unit_name: `Unit-${u + 1}`,
      rows: Array.from({ length: 5 }, (_, r) => ({
        row_id: faker.string.uuid(),
        row_name: `Row-${String.fromCharCode(65 + r)}`,
        columns: Array.from({ length: 8 }, (_, c) => ({
          column_id: faker.string.uuid(),
          column_name: `Col-${c + 1}`,
        })),
      })),
    }));

    const warehouse = await Warehouse.create({
      name: `Warehouse ${faker.company.name()}`,
      address: faker.location.streetAddress(),
      location: faker.location.city(),
      tags: ["active", "main"],
      units,
    });

    const flatColumnLocations = units.flatMap((unit) =>
      unit.rows.flatMap((row) =>
        row.columns.map((col) => ({
          unit_name: unit.unit_name,
          row_name: row.row_name,
          column_name: col.column_name,
        }))
      )
    );

    const Itemss = await Items.insertMany(
      flatColumnLocations.slice(0, 20).map((loc) => ({
        name: faker.commerce.productName(),
        category: faker.commerce.department(),
        sku: faker.string.alphanumeric(8).toUpperCase(),
        quantity: randomInt(10, 100),
        unit_price: parseFloat(faker.commerce.price({ min: 5, max: 100 })),
        hold_units: randomInt(0, 10),
        tags: faker.helpers.arrayElements(
          ["fragile", "inventory", "high-priority"],
          2
        ),
        dimensions: {
          length: randomInt(1, 20),
          width: randomInt(1, 20),
          height: randomInt(1, 20),
          weight: randomInt(1, 10),
        },
        storage_location: {
          warehouse_id: warehouse._id,
          unit_name: loc.unit_name,
          row_name: loc.row_name,
          column_name: loc.column_name,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
    );

    const po = await PurchaseOrder.create({
      party_id: parties.find((p) => p.isVendor)._id,
      isVendor: true,
      order_date: new Date(),
      status: "Open",
      Items: Itemss.map((Items) => ({
        Items_id: Items._id,
        quantity_ordered: randomInt(5, 20),
        received_quantity: randomInt(0, 5),
      })),
      pallets: [],
    });

    const palletSpecs = [
      {
        name: "Amazon",
        type: "Standard",
        length: 48,
        width: 40,
        height: 60,
        weight: 2000,
      }, // Typical North American GMA pallet
      {
        name: "Home Depot",
        type: "Heavy Duty",
        length: 48,
        width: 48,
        height: 72,
        weight: 2500,
      }, // Oversized square
      {
        name: "International",
        type: "Euro",
        length: 47.24,
        width: 31.5,
        height: 59.06,
        weight: 1500,
      }, // EUR-pallet
      {
        name: "Europe",
        type: "Industrial",
        length: 47.24,
        width: 39.37,
        height: 63,
        weight: 2200,
      }, // ISO standard pallet
    ];

    const pallets = await Pallet.insertMany(
      Itemss.map((Items, index) => {
        const spec = palletSpecs[index % palletSpecs.length];
        return {
          pallet_name: spec.name,
          pallet_type: spec.type,
          dimensions: {
            length_in: spec.length,
            width_in: spec.width,
            height_in: spec.height,
          },
          max_weight_lb: spec.weight,
          stacking_Items: [Items._id],
          po_id: po._id,
        };
      })
    );

    await PurchaseOrder.findByIdAndUpdate(po._id, {
      pallets: pallets.map((p) => p._id),
    });

    console.log(`\n✅ Seeded:
  - ${parties.length} Parties (Vendors + Customers)
  - 1 Warehouse with 2 Units, 5 Rows each, and 8 Columns
  - ${Itemss.length} Itemss
  - 1 Purchase Order
  - ${pallets.length} Pallets
  `);

    await mongoose.disconnect();
    console.log("🔌 MongoDB disconnected.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
}

seed();
