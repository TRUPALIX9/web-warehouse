// /src/app/api/insights/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    inbound: [120, 150, 130, 170, 180],
    outbound: [100, 140, 120, 160, 170],

    vendors: ['Vendor X', 'Vendor Y', 'Vendor Z'],
    vendorPOCounts: [10, 5, 7],

    stockStatus: [70, 20, 10], // In Stock, Low Stock, Out of Stock

    itemAddedMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    itemAddedCounts: [10, 15, 20, 18, 25],

    poStatus: [5, 15, 2], // Pending, Received, Cancelled
  });
}
