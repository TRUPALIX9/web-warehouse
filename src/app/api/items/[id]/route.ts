import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../db"; // Adjust path if needed
import Items from "../../../models/Items"; // Adjust path if needed

// GET /api/items/[id]
export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = context.params;

    const item = await Items.findById(id).lean();
    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch (err) {
    console.error("GET /api/items/[id] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// PUT /api/items/[id]
export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = context.params;
    const data = await req.json();

    const updated = await Items.findByIdAndUpdate(id, data, { new: true });
    if (!updated) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (err) {
    console.error("PUT /api/items/[id] error:", err);
    return NextResponse.json(
      { error: "Failed to update item" },
      { status: 500 }
    );
  }
}
