// /pages/api/items/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../db';
import Item from '../models/Item';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  switch (req.method) {
    case 'GET': {
      const items = await Item.find({});
      return res.status(200).json(items);
    }
    case 'POST': {
      try {
        const item = new Item(req.body);
        const savedItem = await item.save();
        return res.status(201).json(savedItem);
      } catch (error: any) {
        return res.status(400).json({ error: error.message });
      }
    }
    default:
      return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
