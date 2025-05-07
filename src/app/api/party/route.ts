import { NextResponse } from "next/server";
import Party from "../models/Party";
import connectDB from "../db";

export async function GET() {
  await connectDB();
  const parties = await Party.find();
  return NextResponse.json(parties);
}

export async function POST(req: Request) {
  await connectDB();
  const data = await req.json();
  const created = await Party.create(data);
  return NextResponse.json(created);
}
