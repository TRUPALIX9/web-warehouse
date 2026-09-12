import connectDB from "../../db";
import PurchaseOrder from "../../../models/PurchaseOrder";
import { NextResponse, NextRequest } from "next/server";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  await connectDB();

  const id = await params?.id;
  if (!id || typeof id !== "string") {
    return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
  }

  try {
    const order = await PurchaseOrder.findById(id)
      .populate("party_id")
      .populate("items.item_id")
      .populate({
        path: "pallets",
        populate: {
          path: "stacking_items",
          model: "Items",
        },
      });

    if (!order) {
      return NextResponse.json({ message: "Not Found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (err) {
    return NextResponse.json(
      { message: "Error fetching PO", error: err },
      { status: 500 }
    );
  }
}
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();

  try {
    const id = params.id;
    const body = await req.json();

    const { items, pallets } = body;

    const updated = await PurchaseOrder.findByIdAndUpdate(
      id,
      {
        items,
        pallets,
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { error: "Purchase order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("PUT /purchase-orders/[id] error:", error);
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}

// DELETE: remove a PO
export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();

  try {
    const { id } = await params;
    const deleted = await PurchaseOrder.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { message: "Purchase order not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("DELETE /purchase-orders/[id] error:", error);
    return NextResponse.json(
      { message: "Failed to delete purchase order" },
      { status: 500 }
    );
  }
}
