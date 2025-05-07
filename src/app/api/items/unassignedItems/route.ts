import { NextResponse } from "next/server";
import connectDB from "../../db";
import Items from "../../../models/Items";

export async function GET() {
  await connectDB();

  try {
    const availableSpace = await Items.find({
      $or: [
        { "storage_location.unit_id": { $exists: false } },
        { "storage_location.row_id": { $exists: false } },
        { "storage_location.column_id": { $exists: false } },
      ],
    });

    return NextResponse.json(availableSpace);
  } catch (error) {
    console.error("Error fetching available space items:", error);
    return NextResponse.json(
      { message: "Error fetching items" },
      { status: 500 }
    );
  }
}
