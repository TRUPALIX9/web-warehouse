// src/app/api/items/unassign/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../db";
import Items from "../../models/Items";
import Warehouse from "../../models/Warehouse";
import mongoose from "mongoose";

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const { warehouse_id, unit_name, row_name, column_name } = await req.json();

    if (!warehouse_id || !unit_name || !row_name || !column_name) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const warehouseObjectId = new mongoose.Types.ObjectId(warehouse_id);

    // Step 1: Remove assigned_item_id from warehouse column
    const warehouse = await Warehouse.findOne({ _id: warehouseObjectId });
    if (!warehouse) throw new Error("Warehouse not found");

    for (const unit of warehouse.units) {
      if (unit.unit_name === unit_name) {
        for (const row of unit.rows) {
          if (row.row_name === row_name) {
            for (const column of row.columns) {
              if (column.column_name === column_name) {
                column.assigned_item_id = null;
              }
            }
          }
        }
      }
    }

    await warehouse.save();

    // Step 2: Unassign item from Items collection
    await Items.updateOne(
      {
        "storage_location.warehouse_id": warehouseObjectId,
        "storage_location.unit_name": unit_name,
        "storage_location.row_name": row_name,
        "storage_location.column_name": column_name,
      },
      {
        $unset: {
          storage_location: "",
        },
      }
    );

    return NextResponse.json({ message: "Unassigned successfully" });
  } catch (err) {
    console.error("Unassign route error:", err);
    return NextResponse.json(
      { error: "Failed to unassign item" },
      { status: 500 }
    );
  }
}
