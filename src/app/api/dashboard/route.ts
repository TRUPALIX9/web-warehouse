import { NextResponse } from "next/server";
import connectDB from "../../../app/api/db"; // ✅ matches your file structure

import Items from "../../models/Items";
import PurchaseOrder from "../../models/PurchaseOrder";
import Pallet from "../../models/Pallet";
import Vendor from "../../models/Vendor";
import Warehouse from "../../models/Warehouse";

export async function GET() {
  try {
    await connectDB();

    const now = new Date();
    const months: string[] = [];
    const inbound: number[] = [];
    const outbound: number[] = [];

    // Iterate over last 6 months
    for (let i = 5; i >= 0; i--) {
      const from = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const to = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

      const label = from.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
      months.push(label);

      const inboundCount = await PurchaseOrder.countDocuments({
        type: "inbound",
        createdAt: { $gte: from, $lt: to },
      });

      const outboundCount = await PurchaseOrder.countDocuments({
        type: "outbound",
        createdAt: { $gte: from, $lt: to },
      });

      inbound.push(inboundCount);
      outbound.push(outboundCount);
    }

    const stats = {
      items: await Items.countDocuments(),
      purchaseOrders: await PurchaseOrder.countDocuments(),
      lowStock: await Items.countDocuments({ quantity: { $lt: 10 } }),
      pallets: await Pallet.countDocuments(),
      vendors: await Vendor.countDocuments(),
      warehouses: await Warehouse.countDocuments(),
    };

    const insights = { months, inbound, outbound };

    return NextResponse.json({ stats, insights }, { status: 200 });
  } catch (error) {
    console.error("[DASHBOARD_ERROR]", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
