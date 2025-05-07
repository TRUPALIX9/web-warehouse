import { NextRequest, NextResponse } from "next/server";
import Warehouse from "../../models/Warehouse";
import connectDB from "../../db";

// PUT (Update) a warehouse
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const body = await req.json();
    const updated = await Warehouse.findByIdAndUpdate(params.id, body, {
      new: true,
    });
    if (!updated) {
      return NextResponse.json(
        { error: "Warehouse not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(updated);
  } catch (err) {
    console.error("[PUT /warehouse/:id] Error:", err);
    return NextResponse.json(
      { error: "Failed to update warehouse" },
      { status: 500 }
    );
  }
}

// DELETE a warehouse
export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const deleted = await Warehouse.findByIdAndDelete(params.id);
    if (!deleted) {
      return NextResponse.json(
        { error: "Warehouse not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: "Warehouse deleted successfully" });
  } catch (err) {
    console.error("[DELETE /warehouse/:id] Error:", err);
    return NextResponse.json(
      { error: "Failed to delete warehouse" },
      { status: 500 }
    );
  }
}
