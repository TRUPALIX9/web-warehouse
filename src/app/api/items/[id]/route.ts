import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../db";
import Items from "../../models/Items";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const item = await Items.findById(params.id)
      .populate("storage_location.warehouse_id", "name")
      .lean();
    if (!item)
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    return NextResponse.json(item);
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const body = await req.json();
    const updated = await Items.findByIdAndUpdate(params.id, body, {
      new: true,
    });
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to update item" },
      { status: 500 }
    );
  }
}
