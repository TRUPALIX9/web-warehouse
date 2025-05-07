// /pages/api/actions/po/status.ts
import type { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "../../db";
import PurchaseOrder from "../../../models/PurchaseOrder";
import Items from "../../../models/Items";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectToDatabase();
  if (req.method !== "PATCH")
    return res.status(405).json({ message: "Method Not Allowed" });

  const { po_id, new_status } = req.body;
  try {
    const po = await PurchaseOrder.findById(po_id);
    if (!po) return res.status(404).json({ error: "Purchase Order not found" });
    if (new_status === "Completed") {
      for (const itemsLine of po.items) {
        await Items.findByIdAndUpdate(itemsLine.item_id, {
          $inc: { quantity: itemsLine.received_quantity },
        });
      }
    }
    po.status = new_status;
    await po.save();
    return res.status(200).json(po);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}
