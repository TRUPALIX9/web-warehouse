// /src/app/api/models/PurchaseOrder.ts
import mongoose, { Document, Schema, Types } from "mongoose";

interface OrderItem {
  item_id: Types.ObjectId;
  quantity_ordered: number;
  received_quantity: number;
}

export interface IPurchaseOrder extends Document {
  party_id: Types.ObjectId;
  isVendor: boolean;
  order_date: Date;
  status: string;
  items: OrderItem[];
  pallets: Types.ObjectId[];
}

const PurchaseOrderSchema = new Schema<IPurchaseOrder>({
  party_id: { type: Schema.Types.ObjectId, ref: "Party" },
  isVendor: Boolean,
  order_date: Date,
  status: String,
  items: [
    {
      item_id: { type: Schema.Types.ObjectId, ref: "Items" },
      quantity_ordered: Number,
      received_quantity: Number,
    },
  ],
  pallets: [{ type: Schema.Types.ObjectId, ref: "Pallet" }],
});

export default mongoose.models.PurchaseOrder ||
  mongoose.model<IPurchaseOrder>("PurchaseOrder", PurchaseOrderSchema);
