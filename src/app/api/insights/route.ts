import { NextResponse } from "next/server";
import PurchaseOrder from "../../models/PurchaseOrder";

export async function GET() {
  const now = new Date();
  const months = [...Array(6)].map((_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return d.toLocaleString("default", { month: "short" });
  });

  const pipeline: any = [
    {
      $match: {
        order_date: {
          $gte: new Date(now.getFullYear(), now.getMonth() - 5, 1),
        },
      },
    },
    {
      $group: {
        _id: {
          month: { $month: "$order_date" },
          year: { $year: "$order_date" },
        },
        inbound: { $sum: { $cond: ["$isVendor", 1, 0] } },
        outbound: { $sum: { $cond: ["$isVendor", 0, 1] } },
      },
    },
    {
      $sort: {
        "_id.year": 1,
        "_id.month": 1,
      },
    },
  ];

  const results = await PurchaseOrder.aggregate(pipeline);

  const inbound = new Array(6).fill(0);
  const outbound = new Array(6).fill(0);

  results.forEach((entry) => {
    const index = months.findIndex(
      (m, i) =>
        new Date(now.getFullYear(), now.getMonth() - (5 - i), 1).getMonth() ===
        entry._id.month - 1
    );
    if (index !== -1) {
      inbound[index] = entry.inbound;
      outbound[index] = entry.outbound;
    }
  });

  return NextResponse.json({ months, inbound, outbound });
}
