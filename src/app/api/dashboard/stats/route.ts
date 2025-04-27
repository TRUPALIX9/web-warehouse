import { NextResponse } from 'next/server';

export async function GET() {
  // Mock dashboard stats
  return NextResponse.json({
    items: 1520,
    purchaseOrders: 12,
    lowStock: 8,
    pallets: 430,
  });
}
