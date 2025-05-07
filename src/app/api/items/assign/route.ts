// /api/items/assign.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../db";
import Items from "../../../models/Items";
import Warehouse from "../../../models/Warehouse";

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const {
      itemId,
      warehouse_id,
      unit_id,
      unit_name,
      row_id,
      row_name,
      column_id,
      column_name,
    } = await req.json();

    // Update item with full storage location
    await Items.findByIdAndUpdate(itemId, {
      storage_location: {
        warehouse_id,
        unit_id,
        unit_name,
        row_id,
        row_name,
        column_id,
        column_name,
      },
    });

    // Assign item in the warehouse layout
    await Warehouse.updateOne(
      {
        _id: warehouse_id,
        "units.unit_id": unit_id,
        "units.rows.row_id": row_id,
        "units.rows.columns.column_id": column_id,
      },
      {
        $set: {
          "units.$[u].rows.$[r].columns.$[c].assigned_item_id": itemId,
        },
      },
      {
        arrayFilters: [
          { "u.unit_id": unit_id },
          { "r.row_id": row_id },
          { "c.column_id": column_id },
        ],
      }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PUT /api/items/assign error:", err);
    return NextResponse.json({ error: "Assignment failed" }, { status: 500 });
  }
}
