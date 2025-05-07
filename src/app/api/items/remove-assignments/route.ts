import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../db";
import Items from "../../../models/Items";

export async function PUT(req: NextRequest) {
  await connectDB();
  const { warehouse_id } = await req.json();

  try {
    const result = await Items.updateMany(
      {
        "storage_location.warehouse_id": warehouse_id,
      },
      {
        $unset: {
          "storage_location.warehouse_id": "",
          "storage_location.unit_id": "",
          "storage_location.row_id": "",
          "storage_location.column_id": "",
        },
      }
    );

    return NextResponse.json(
      { message: "Unassigned items", modifiedCount: result.modifiedCount },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to unassign items", error);
    return NextResponse.json(
      { error: "Failed to unassign items" },
      { status: 500 }
    );
  }
}
