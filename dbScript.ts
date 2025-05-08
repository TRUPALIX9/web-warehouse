// seed.ts - Populate MongoDB WMS with unique entries using faker
import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import Warehouse from "./src/app/models/Warehouse";
import Items from "./src/app/models/Items";
import Party from "./src/app/models/Party";
import PurchaseOrder from "./src/app/models/PurchaseOrder";

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
      ...Array.from({ length: 3 }, () => ({
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

    const UNITS = ["A", "B", "C"];
    const ROWS = ["A", "B", "C"];
    const COLUMNS = ["1", "2", "3"];

    const itemsToAssign: any[] = [];

    const units = UNITS.map((unitId) => ({
      unit_id: unitId,
      unit_name: unitId,
      rows: ROWS.map((rowId) => ({
        row_id: rowId,
        row_name: rowId,
        columns: COLUMNS.map((colId) => {
          const column_id = colId;
          const column_name = colId;
          const itemName = faker.commerce.productName();
          const itemSku = faker.string.alphanumeric(8).toUpperCase();
          const item_id = faker.database.mongodbObjectId();

          const item = {
            _id: item_id,
            name: itemName,
            sku: itemSku,
            quantity: randomInt(10, 100),
            unit_price: parseFloat(faker.commerce.price({ min: 5, max: 100 })),
            hold_units: randomInt(0, 10),
            category: faker.commerce.department(),
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
              warehouse_id: undefined, // to be set later
              unit_id: unitId,
              unit_name: unitId,
              row_id: rowId,
              row_name: rowId,
              column_id,
              column_name,
            },
          };

          itemsToAssign.push(item);

          return {
            column_id,
            column_name,
            assigned_item_id: item_id,
            item_info: {
              name: itemName,
              sku: itemSku,
            },
          };
        }),
      })),
    }));

    const warehouse = await Warehouse.create({
      name: "DEMO",
      address: faker.location.streetAddress(),
      location: faker.location.city(),
      tags: ["Main", "Simulation"],
      units,
    });

    const items = itemsToAssign.map((item) => ({
      ...item,
      storage_location: {
        ...item.storage_location,
        warehouse_id: warehouse._id,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await Items.insertMany(items);

    for (let i = 0; i < 10; i++) {
      const party = faker.helpers.arrayElement(parties);
      const poItems = faker.helpers.arrayElements(items, { min: 5, max: 10 });

      const pallets = Array.from({ length: randomInt(1, 3) }).map(() => {
        const stacked = faker.helpers.arrayElements(poItems, {
          min: 2,
          max: 5,
        });
        return {
          pallet_name: `Pallet-${faker.string.alphanumeric(5)}`,
          pallet_type: faker.helpers.arrayElement(["Standard", "Heavy-Duty"]),
          dimensions: {
            length_in: 48,
            width_in: 40,
            height_in: 60,
          },
          stacking_items: stacked.map((item) => ({
            name: item.name,
            sku: item.sku,
            storage_location: item.storage_location,
          })),
        };
      });

      await PurchaseOrder.create({
        party_id: party._id,
        isVendor: party.isVendor,
        order_date: new Date(),
        status: "Open",
        items: poItems.map((item) => ({
          item_id: item._id,
          quantity_ordered: randomInt(5, 20),
          received_quantity: randomInt(0, 5),
        })),
        pallets,
      });
    }

    console.log(
      "\n✅ Seeded: \n  - 6 Parties\n  - 1 Warehouse with 3 Units, 3 Rows, 3 Columns and assigned item info\n  - 50 Items\n  - 10 Purchase Orders\n"
    );
    await mongoose.disconnect();
    console.log("🔌 MongoDB disconnected.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
}

seed();
