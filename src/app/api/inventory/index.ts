// src/pages/api/inventory/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../db';
import Item from '../models/Item';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { search = '', tag } = req.query;
  const query: any = {};

  if (search) {
    query.$or = [
      { name: { $regex: search.toString(), $options: 'i' } },
      { sku: { $regex: search.toString(), $options: 'i' } },
    ];
  }

  if (tag) {
    query.tags = tag;
  }

  try {
    const items = await Item.find(query).lean();
    return res.status(200).json(items);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
