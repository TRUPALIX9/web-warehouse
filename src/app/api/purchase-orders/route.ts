import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json([
    {
      id: 'PO-1001',
      vendor: 'Vendor X',
      status: 'Pending',
      createdAt: '2025-04-01',
      expectedDelivery: '2025-04-15',
      totalItems: 120,
    },
    {
      id: 'PO-1002',
      vendor: 'Vendor Y',
      status: 'Received',
      createdAt: '2025-03-28',
      expectedDelivery: '2025-04-10',
      totalItems: 80,
    },
    {
      id: 'PO-1003',
      vendor: 'Vendor Z',
      status: 'Cancelled',
      createdAt: '2025-03-30',
      expectedDelivery: '2025-04-20',
      totalItems: 60,
    },
  ]);
}
