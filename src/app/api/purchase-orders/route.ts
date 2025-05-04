import connectDB from "../db";
import PurchaseOrder from "../../../app/api/models/PurchaseOrder";
import "../../../app/api/models/Party";
import "../../../app/api/models/Items";
import "../../../app/api/models/Pallet";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const orders = await PurchaseOrder.find()
      .populate({
        path: "party_id",
        select: "name isVendor contact_info",
      })
      .populate({
        path: "items.item_id",
        select: "name sku unit_price",
      })
      .populate({
        path: "pallets",
        select: "pallet_name pallet_type dimensions stacking_items",
        populate: {
          path: "stacking_items",
          select: "name sku",
        },
      });

    return NextResponse.json(orders);
  } catch (err) {
    console.error("GET /purchase-orders failed:", err);
    return NextResponse.json(
      { error: "Failed to fetch purchase orders" },
      { status: 500 }
    );
  }
}
