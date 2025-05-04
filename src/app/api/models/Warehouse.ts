// /src/app/api/models/Warehouse.ts
import mongoose, { Document, Schema, Types } from "mongoose";

interface Column {
  column_id: string;
  column_name: string;
  assigned_item_id?: Types.ObjectId;
}

interface Row {
  row_id: string;
  row_name: string;
  columns: Column[];
}

interface Unit {
  unit_id: string;
  unit_name: string;
  rows: Row[];
}

export interface IWarehouse extends Document {
  name: string;
  address: string;
  location: string;
  tags: string[];
  units: Unit[];
}

const ColumnSchema = new Schema<Column>(
  {
    column_id: String,
    column_name: String,
    assigned_item_id: { type: Schema.Types.ObjectId, ref: "Item" },
  },
  { _id: false }
);

const RowSchema = new Schema<Row>(
  {
    row_id: String,
    row_name: String,
    columns: [ColumnSchema],
  },
  { _id: false }
);

const UnitSchema = new Schema<Unit>(
  {
    unit_id: String,
    unit_name: String,
    rows: [RowSchema],
  },
  { _id: false }
);

const WarehouseSchema = new Schema<IWarehouse>({
  name: String,
  address: String,
  location: String,
  tags: [String],
  units: [UnitSchema],
});

export default mongoose.models.Warehouse ||
  mongoose.model<IWarehouse>("Warehouse", WarehouseSchema);
