// seed.ts - Populate MongoDB WMS with unique entries using faker
import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import Warehouse from "./src/app/models/Warehouse";
import Items from "./src/app/models/Items";
import Party from "./src/app/models/Party";
import PurchaseOrder from "./src/app/models/PurchaseOrder";
import Pallet from "./src/app/models/Pallet";

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

    const units = Array.from({ length: 2 }, (_, u) => {
      const unit_id = faker.string.uuid();
      return {
        unit_id,
        unit_name: `Unit-${u + 1}`,
        rows: Array.from({ length: 5 }, (_, r) => {
          const row_id = faker.string.uuid();
          return {
            row_id,
            row_name: `Row-${String.fromCharCode(65 + r)}`,
            columns: Array.from({ length: 8 }, (_, c) => {
              const column_id = faker.string.uuid();
              return {
                column_id,
                column_name: `Col-${c + 1}`,
              };
            }),
          };
        }),
      };
    });

    const warehouse = await Warehouse.create({
      name: `Warehouse ${faker.company.name()}`,
      address: faker.location.streetAddress(),
      location: faker.location.city(),
      tags: ["active", "main"],
      units,
    });

    const flatColumnLocations: any[] = [];
    units.forEach((unit) => {
      const unit_id = unit.unit_id;
      const unit_name = unit.unit_name;

      unit.rows.forEach((row) => {
        const row_id = row.row_id;
        const row_name = row.row_name;

        row.columns.forEach((col) => {
          flatColumnLocations.push({
            unit_id,
            unit_name,
            row_id,
            row_name,
            column_id: col.column_id,
            column_name: col.column_name,
          });
        });
      });
    });

    const items = await Items.insertMany(
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
        // storage_location: {
        //   warehouse_id: warehouse._id,
        //   unit_id: loc.unit_id,
        //   unit_name: loc.unit_name,
        //   row_id: loc.row_id,
        //   row_name: loc.row_name,
        //   column_id: loc.column_id,
        //   column_name: loc.column_name,
        // },
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
    );

    const po = await PurchaseOrder.create({
      party_id: parties.find((p) => p.isVendor)._id,
      isVendor: true,
      order_date: new Date(),
      status: "Open",
      Items: items.map((item) => ({
        Items_id: item._id,
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
      },
      {
        name: "Home Depot",
        type: "Heavy Duty",
        length: 48,
        width: 48,
        height: 72,
        weight: 2500,
      },
      {
        name: "International",
        type: "Euro",
        length: 47.24,
        width: 31.5,
        height: 59.06,
        weight: 1500,
      },
      {
        name: "Europe",
        type: "Industrial",
        length: 47.24,
        width: 39.37,
        height: 63,
        weight: 2200,
      },
    ];

    const pallets = await Pallet.insertMany(
      items.map((item, index) => {
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
          stacking_Items: [item._id],
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
  - ${items.length} Items
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
