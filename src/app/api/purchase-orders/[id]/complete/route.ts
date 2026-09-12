import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../db";
import PurchaseOrder from "../../../../models/PurchaseOrder";
import Items from "../../../../models/Items";

export async function PUT(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();

  try {
    const { id } = await params;

    // Completing twice would move the stock twice. Claim the PO atomically
    // (only a PO that is not yet Completed matches), so two concurrent
    // requests cannot both pass the check and both apply the stock change.
    const po = await PurchaseOrder.findOneAndUpdate(
      { _id: id, status: { $ne: "Completed" } },
      { $set: { status: "Completed" } },
      { new: true }
    ).populate("party_id");

    if (!po) {
      const exists = await PurchaseOrder.exists({ _id: id });
      return exists
        ? NextResponse.json(
            { message: "PO is already completed" },
            { status: 409 }
          )
        : NextResponse.json({ message: "PO not found" }, { status: 404 });
    }

    // Vendor POs ship stock out; supplier POs bring it in.
    const isVendor = po.isVendor ?? po.party_id?.isVendor;

    // Apply the quantities saved on the PO, not whatever the client sends.
    for (const entry of po.items) {
      const item = await Items.findById(entry.item_id);
      if (!item) continue;

      const delta = entry.quantity_ordered || 0;

      if (isVendor) {
        item.quantity = Math.max(0, item.quantity - delta);
      } else {
        item.quantity += delta;
      }

      await item.save();
    }

    return NextResponse.json(po);
  } catch (err) {
    console.error("Error completing PO:", err);
    return NextResponse.json(
      { message: "Failed to complete PO" },
      { status: 500 }
    );
  }
}
