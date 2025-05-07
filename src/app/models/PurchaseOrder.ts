import mongoose, { Document, Schema, Types } from "mongoose";

interface StorageLocation {
  warehouse_id: Types.ObjectId;
  unit_id: string;
  row_id: string;
  column_id: string;
  unit_name: string;
  row_name: string;
  column_name: string;
}

interface StackingItem {
  name: string;
  sku: string;
  storage_location: StorageLocation;
}

interface Pallet {
  pallet_name: string;
  pallet_type: string;
  dimensions: {
    length_in: number;
    width_in: number;
    height_in: number;
  };
  stacking_items: StackingItem[];
}

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
  pallets: Pallet[];
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
  pallets: [
    {
      pallet_name: String,
      pallet_type: String,
      dimensions: {
        length_in: Number,
        width_in: Number,
        height_in: Number,
      },
      stacking_items: [
        {
          name: String,
          sku: String,
          storage_location: {
            warehouse_id: { type: Schema.Types.ObjectId, ref: "Warehouse" },
            unit_id: String,
            row_id: String,
            column_id: String,
            unit_name: String,
            row_name: String,
            column_name: String,
          },
        },
      ],
    },
  ],
});

export default mongoose.models.PurchaseOrder ||
  mongoose.model<IPurchaseOrder>("PurchaseOrder", PurchaseOrderSchema);
