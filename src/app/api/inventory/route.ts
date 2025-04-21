// src/app/api/inventory/route.ts or pages/api/inventory.ts

import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';  // Ensure this path is correct for your MongoDB connection

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const inventoryCollection = db.collection('Inventory');
    const inventory = await inventoryCollection.find({}).toArray();
    
    return NextResponse.json(inventory);  // Return the inventory data as JSON
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return NextResponse.json({ message: 'Error fetching inventory' }, { status: 500 });
  }
}
