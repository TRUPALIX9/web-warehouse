// app/api/dashboard/summary/route.ts
import { NextResponse } from "next/server";
import connectDB from "../../db";
import Items from "../../../models/Items";
import PurchaseOrder from "../../../models/PurchaseOrder";

export async function GET() {
  await connectDB();

  const [items, pos] = await Promise.all([
    Items.find({}),
    PurchaseOrder.find({}),
  ]);

  const totalItems = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const totalPOs = pos.length;
  const openPOs = pos.filter((p) => p.status === "Open").length;
  const closedPOs = pos.filter((p) => p.status === "Closed").length;

  const categories: Record<string, number> = {};
  items.forEach((item) => {
    const cat = item.category || "Uncategorized";
    categories[cat] = (categories[cat] || 0) + 1;
  });

  const itemCountsPerPO = pos.map((po) => ({
    po: po._id.toString().slice(-6),
    count: po.items.length,
  }));

  const vendorVsSupplierPOs = [
    { label: "Vendors", count: pos.filter((p) => p.isVendor).length },
    { label: "Suppliers", count: pos.filter((p) => !p.isVendor).length },
  ];

  const topStockedItems = items
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5)
    .map((i) => ({ name: i.name, quantity: i.quantity }));

  const top10BarItems = items
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 10)
    .map((i) => ({ name: i.name, quantity: i.quantity }));

  const least10BarItems = items
    .sort((a, b) => a.quantity - b.quantity)
    .slice(0, 10)
    .map((i) => ({ name: i.name, quantity: i.quantity }));

  const poItemMap = new Map<string, number>();
  pos.forEach((po) => {
    po.items.forEach((it) => {
      const id = it.item_id?.toString();
      if (id) {
        poItemMap.set(
          id,
          (poItemMap.get(id) || 0) + (it.quantity_ordered || 0)
        );
      }
    });
  });
  const itemsInPO = Array.from(poItemMap.values()).reduce(
    (sum, qty) => sum + qty,
    0
  );
  const itemsNotInPO = totalItems - itemsInPO;

  const poCoverage = [
    { label: "In PO", count: itemsInPO },
    { label: "Not in PO", count: itemsNotInPO },
  ];

  return NextResponse.json({
    totalItems,
    totalPOs,
    openPOs,
    closedPOs,
    categories,
    itemCountsPerPO,
    vendorVsSupplierPOs,
    topStockedItems,
    top10BarItems,
    least10BarItems,
    poCoverage,
  });
}
