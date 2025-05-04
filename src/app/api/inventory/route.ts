// /src/app/api/inventory/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../app/api/db";
import Items from "../models/Items";

export async function GET(req: NextRequest) {
  await connectDB();

  const items = await Items.find({}); // Fetch all items

  return NextResponse.json({ items });
}
