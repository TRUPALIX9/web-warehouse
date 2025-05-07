import { NextResponse } from "next/server";
import connectDB from "../db";
import Warehouse from "../../models/Warehouse";
import Items from "../../models/Items";
import { Types } from "mongoose";
import { IWarehouse } from "../../../types/warehouse";

export async function GET() {
  try {
    await connectDB();

    const rawWarehouses = await Warehouse.find({}).lean();

    // Type assertion to satisfy TypeScript
    const warehouses = rawWarehouses as unknown as IWarehouse[];

    const itemIdSet = new Set<string>();
    warehouses.forEach((wh) =>
      wh.units?.forEach((unit) =>
        unit.rows?.forEach((row) =>
          row.columns?.forEach((col) => {
            if (col.assigned_item_id) {
              itemIdSet.add(col.assigned_item_id.toString());
            }
          })
        )
      )
    );

    const items = await Items.find({
      _id: { $in: Array.from(itemIdSet).map((id) => new Types.ObjectId(id)) },
    }).lean();

    const itemMap = new Map(
      items.map((item: any) => [
        (item._id as Types.ObjectId).toString(),
        { name: item.name, sku: item.sku },
      ])
    );

    warehouses.forEach((wh) =>
      wh.units?.forEach((unit) =>
        unit.rows?.forEach((row) =>
          row.columns?.forEach((col) => {
            const itemInfo = itemMap.get(col.assigned_item_id?.toString());
            if (itemInfo) {
              col.item_info = itemInfo;
            }
          })
        )
      )
    );

    return NextResponse.json(warehouses, { status: 200 });
  } catch (error) {
    console.error("GET /warehouse error:", error);
    return NextResponse.json(
      { error: "Failed to fetch warehouses" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();
    const newWarehouse = await Warehouse.create(data);
    return NextResponse.json(newWarehouse, { status: 201 });
  } catch (error) {
    console.error("POST /warehouse error:", error);
    return NextResponse.json(
      { error: "Failed to create warehouse" },
      { status: 500 }
    );
  }
}
