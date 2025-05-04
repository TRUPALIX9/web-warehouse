// /pages/api/actions/item/hold.ts
import type { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "../db";
import Items from "../models/Items";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectToDatabase();
  if (req.method !== "PATCH")
    return res.status(405).json({ message: "Method Not Allowed" });

  const { item_id, hold_units } = req.body;
  try {
    const updated = await Items.findByIdAndUpdate(
      item_id,
      { hold_units },
      { new: true }
    );
    return res.status(200).json(updated);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}
