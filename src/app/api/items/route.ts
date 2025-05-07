// /src/app/api/items/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "../db";
import Items from "../../models/Items";
import Warehouse from "../../models/Warehouse";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const data = await req.json();

    // Create the new item
    const newItem = await Items.create(data);

    // const { warehouse_id, unit_id, row_id, column_id } = data.storage_location;

    // // Update the warehouse to assign the item ID to the specified column
    // await Warehouse.updateOne(
    //   {
    //     _id: warehouse_id,
    //     "units.unit_id": unit_id,
    //     "units.rows.row_id": row_id,
    //     "units.rows.columns.column_id": column_id,
    //   },
    //   {
    //     $set: {
    //       "units.$[u].rows.$[r].columns.$[c].assigned_item_id": newItem._id,
    //     },
    //   },
    //   {
    //     arrayFilters: [
    //       { "u.unit_id": unit_id },
    //       { "r.row_id": row_id },
    //       { "c.column_id": column_id },
    //     ],
    //   }
    // );

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("POST /api/items error:", error);
    return NextResponse.json(
      { error: "Failed to create item and update warehouse" },
      { status: 500 }
    );
  }
}
