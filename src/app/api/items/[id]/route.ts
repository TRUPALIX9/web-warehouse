import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../db"; // Adjust path as needed
import Items from "../../../models/Items"; // Adjust path as needed

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = await context.params; // ✅ use context.params

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
