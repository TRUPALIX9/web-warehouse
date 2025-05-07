// /api/items/unassign.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../db";
import Items from "../../../models/Items";
import Warehouse from "../../../models/Warehouse";

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const { warehouse_id, unit_id, row_id, column_id } = await req.json();

    // Unassign item in warehouse layout
    const warehouse = await Warehouse.findOne({
      _id: warehouse_id,
    });

    const unit = warehouse.units.find((u: any) => u.unit_id === unit_id);
    const row = unit?.rows.find((r: any) => r.row_id === row_id);
    const col = row?.columns.find((c: any) => c.column_id === column_id);
    const assignedItemId = col?.assigned_item_id;

    if (assignedItemId) {
      await Items.findByIdAndUpdate(assignedItemId, {
        $unset: { storage_location: "" },
      });
    }

    await Warehouse.updateOne(
      {
        _id: warehouse_id,
        "units.unit_id": unit_id,
        "units.rows.row_id": row_id,
        "units.rows.columns.column_id": column_id,
      },
      {
        $unset: {
          "units.$[u].rows.$[r].columns.$[c].assigned_item_id": "",
        },
      },
      {
        arrayFilters: [
          { "u.unit_id": unit_id },
          { "r.row_id": row_id },
          { "c.column_id": column_id },
        ],
      }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PUT /api/items/unassign error:", err);
    return NextResponse.json({ error: "Unassignment failed" }, { status: 500 });
  }
}
