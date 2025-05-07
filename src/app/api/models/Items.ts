import mongoose, { Document, Schema, Types } from "mongoose";

interface Dimensions {
  length?: number;
  width?: number;
  height?: number;
  weight?: number;
}

interface StorageLocation {
  warehouse_id: {
    type: mongoose.Schema.Types.ObjectId;
    ref: "Warehouse";
    required: false;
  };
  unit_name?: string;
  row_name?: string;
  column_name?: string;
}

export interface IItems extends Document {
  name: string;
  category?: string;
  sku: string;
  quantity: number;
  unit_price: number;
  hold_units?: number;
  tags?: string[];
  dimensions?: Dimensions;
  storage_location: StorageLocation;
}

const ItemsSchema = new Schema<IItems>(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, trim: true },
    sku: { type: String, required: true, unique: true, trim: true },
    quantity: { type: Number, required: true, default: 0 },
    unit_price: { type: Number, required: true },
    hold_units: { type: Number, default: 0 },
    tags: { type: [String], default: [] },
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
      weight: Number,
    },
    storage_location: {
      warehouse_id: {
        type: Schema.Types.ObjectId,
        ref: "Warehouse",
        required: false,
      },
      unit_name: String,
      row_name: String,
      column_name: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Items ||
  mongoose.model<IItems>("Items", ItemsSchema);
