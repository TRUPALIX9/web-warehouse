import connectDB from "../db";
import PurchaseOrder from "../../models/PurchaseOrder";
import "../../models/Party";
import "../../models/Items";
import "../../models/Pallet";
import { NextResponse, NextRequest } from "next/server";

// ✅ GET: Fetch & categorize POs
export async function GET(req: NextRequest) {
  await connectDB();

  try {
    const orders = await PurchaseOrder.find({})
      .populate("party_id")
      .populate("items.item_id")
      .populate({
        path: "pallets",
        populate: {
          path: "stacking_items",
          model: "Items",
        },
      });

    const incoming = orders.filter((po) => po.party_id?.isVendor === false);
    const outgoing = orders.filter((po) => po.party_id?.isVendor === true);

    return NextResponse.json({ incoming, outgoing });
  } catch (error) {
    console.error("Error fetching POs:", error);
    return NextResponse.json(
      { message: "Failed to fetch purchase orders" },
      { status: 500 }
    );
  }
}

// ✅ POST: Create a new PO
export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const body = await req.json();
    const created = await PurchaseOrder.create(body);
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("POST /api/purchase-orders error:", err);
    return NextResponse.json(
      { message: "Failed to create purchase order", error: err },
      { status: 500 }
    );
  }
}

// ✅ DELETE: Remove a PO
export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    await connectDB();
    const id = context.params.id;
    await PurchaseOrder.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Error deleting PO:", error);
    return NextResponse.json(
      { message: "Failed to delete purchase order" },
      { status: 500 }
    );
  }
}

// ✅ PUT: Update PO
export async function PUT(req: Request, context: { params: { id: string } }) {
  try {
    await connectDB();
    const id = context.params.id;
    const body = await req.json();
    const updated = await PurchaseOrder.findByIdAndUpdate(id, body, {
      new: true,
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating PO:", error);
    return NextResponse.json(
      { message: "Failed to update purchase order" },
      { status: 500 }
    );
  }
}
