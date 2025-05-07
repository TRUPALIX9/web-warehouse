import { NextResponse } from "next/server";
import Party from "../../models/Party";
import connectDB from "../../db";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  await connectDB();
  const party = await Party.findById(params.id);
  return NextResponse.json(party);
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const data = await req.json();
  const updated = await Party.findByIdAndUpdate(params.id, data, { new: true });
  return NextResponse.json(updated);
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();
  await Party.findByIdAndDelete(params.id);
  return NextResponse.json({ message: "Deleted" });
}
