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

    // Split on the PO's own flag so a PO whose party was deleted still shows.
    const isVendorPO = (po: any) => po.isVendor ?? po.party_id?.isVendor;
    const incoming = orders.filter((po) => isVendorPO(po) === false);
    const outgoing = orders.filter((po) => isVendorPO(po) === true);

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

// DELETE and PUT for a single PO live in ./[id]/route.ts
