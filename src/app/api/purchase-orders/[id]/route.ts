import connectDB from "../../db";
import PurchaseOrder from "../../../models/PurchaseOrder";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  await connectDB();

  const id = params?.id;
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
