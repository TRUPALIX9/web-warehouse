import { NextResponse } from "next/server";
import connectDB from "../../../../app/api/db";
import Items from "../../models/Items";

export async function GET() {
  await connectDB();

  try {
    const unassignedItems = await Items.find({
      $or: [
        { "storage_location.unit_name": { $exists: false } },
        { "storage_location.row_name": { $exists: false } },
        { "storage_location.column_name": { $exists: false } },
      ],
    });

    return NextResponse.json(unassignedItems);
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching items" },
      { status: 500 }
    );
  }
}
