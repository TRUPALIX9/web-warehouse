import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../db";
import Items from "../../models/Items";
import Warehouse from "../../models/Warehouse";

export async function PUT(req: NextRequest) {
  await connectDB();
  const { itemId, warehouse_id, unit_name, row_name, column_name } =
    await req.json();

  try {
    // 1. Update the item’s storage location
    const item = await Items.findByIdAndUpdate(
      itemId,
      {
        storage_location: {
          warehouse_id,
          unit_name,
          row_name,
          column_name,
        },
      },
      { new: true }
    );

    // 2. Update the warehouse to assign the item in the correct column
    await Warehouse.updateOne(
      {
        _id: warehouse_id,
        "units.unit_name": unit_name,
        "units.rows.row_name": row_name,
        "units.rows.columns.column_name": column_name,
      },
      {
        $set: {
          "units.$[u].rows.$[r].columns.$[c].assigned_item_id": itemId,
        },
      },
      {
        arrayFilters: [
          { "u.unit_name": unit_name },
          { "r.row_name": row_name },
          { "c.column_name": column_name },
        ],
      }
    );

    return NextResponse.json({ message: "Item assigned", item });
  } catch (error) {
    console.error("Assignment Error:", error);
    return NextResponse.json(
      { message: "Error assigning item" },
      { status: 500 }
    );
  }
}
