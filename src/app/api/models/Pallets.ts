// /src/app/api/models/Pallet.ts
import mongoose, { Document, Schema, Types } from 'mongoose';

interface DimensionsInches {
  length_in: number;
  width_in: number;
  height_in: number;
}

export interface IPallet extends Document {
  pallet_type: string;
  dimensions: DimensionsInches;
  max_weight_lb: number;
  stacking_items: Types.ObjectId[];
  po_id: Types.ObjectId;
}

const PalletSchema = new Schema<IPallet>({
  pallet_type: String,
  dimensions: {
    length_in: Number,
    width_in: Number,
    height_in: Number,
  },
  max_weight_lb: Number,
  stacking_items: [{ type: Schema.Types.ObjectId, ref: 'Item' }],
  po_id: { type: Schema.Types.ObjectId, ref: 'PurchaseOrder' },
});

export default mongoose.models.Pallet || mongoose.model<IPallet>('Pallet', PalletSchema);
