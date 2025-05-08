import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../db";
import PurchaseOrder from "../../../../models/PurchaseOrder";
import Items from "../../../../models/Items";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();

  try {
    const { items } = await req.json();
    const id = params.id;

    // Fetch the PO and confirm existence
    const po = await PurchaseOrder.findById(id).populate("party_id");
    if (!po)
      return NextResponse.json({ message: "PO not found" }, { status: 404 });

    // Adjust item quantities based on PO direction
    for (const entry of items) {
      const item = await Items.findById(entry.item_id);
      if (!item) continue;

      const delta = entry.quantity_ordered || 0;

      if (po.party_id?.isVendor) {
        // Vendor PO — Outgoing → subtract stock
        item.quantity = Math.max(0, item.quantity - delta);
      } else {
        // Supplier PO — Incoming → add stock
        item.quantity += delta;
      }

      await item.save();
    }

    // Update PO status
    po.status = "Completed";
    await po.save();

    return NextResponse.json(po);
  } catch (err) {
    console.error("Error completing PO:", err);
    return NextResponse.json(
      { message: "Failed to complete PO" },
      { status: 500 }
    );
  }
}
