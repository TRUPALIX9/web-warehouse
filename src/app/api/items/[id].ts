// /pages/api/items/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "../db";
import Items from "../models/Items";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectToDatabase();
  const { id } = req.query;

  switch (req.method) {
    case "GET": {
      const item = await Items.findById(id);
      return res.status(200).json(item);
    }
    case "PUT": {
      try {
        const updated = await Items.findByIdAndUpdate(id, req.body, {
          new: true,
        });
        return res.status(200).json(updated);
      } catch (error: any) {
        return res.status(400).json({ error: error.message });
      }
    }
    case "DELETE": {
      await Items.findByIdAndDelete(id);
      return res.status(204).end();
    }
    default:
      return res.status(405).json({ message: "Method Not Allowed" });
  }
}
