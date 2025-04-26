import mongoose, { Document, Schema, Types } from 'mongoose';

interface Dimensions {
  length?: number;
  width?: number;
  height?: number;
  weight?: number;
}

interface StorageLocation {
  warehouse_id: Types.ObjectId; // ✅ Required
  unit_name?: string;
  row_name?: string;
  column_name?: string;
}

export interface IItem extends Document {
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

const ItemSchema = new Schema<IItem>(
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
      warehouse_id: { type: Schema.Types.ObjectId, ref: 'Warehouse', required: true },
      unit_name: String,
      row_name: String,
      column_name: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Item || mongoose.model<IItem>('Item', ItemSchema);
