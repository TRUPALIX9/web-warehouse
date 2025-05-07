// /src/app/api/inventory/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../app/api/db";
import Items from "../../models/Items";
import Warehouse from "../../models/Warehouse";

export async function GET(req: NextRequest) {
  await connectDB();

  const items = await Items.find({}).lean();
  const warehouses = await Warehouse.find({}).lean();

  const enrichedItems = items.map((item) => {
    const loc = item.storage_location || {};
    const warehouse = warehouses.find(
      (w) => w._id.toString() === loc.warehouse_id?.toString()
    );

    let unitName = "";
    let rowName = "";
    let columnName = "";
    let warehouseName = warehouse?.name || "";

    if (warehouse) {
      const unit = warehouse.units.find((u) => u.unit_id === loc.unit_id);
      unitName = unit?.unit_name || "";

      const row = unit?.rows.find((r) => r.row_id === loc.row_id);
      rowName = row?.row_name || "";

      const column = row?.columns.find((c) => c.column_id === loc.column_id);
      columnName = column?.column_name || "";
    }

    return {
      ...item,
      storage_location: {
        ...item.storage_location,
        warehouse_name: warehouseName,
        unit_name: unitName,
        row_name: rowName,
        column_name: columnName,
      },
    };
  });

  return NextResponse.json({ items: enrichedItems });
}
