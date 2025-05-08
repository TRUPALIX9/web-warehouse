import mongoose, { Schema, Document, Model } from "mongoose";

// Interfaces
export interface IColumn {
  column_id?: string;
  column_name?: string;
  assigned_item_id?: string | null;
  item_info?: {
    name?: string;
    sku?: string;
  };
}

export interface IRow {
  row_id?: string;
  row_name?: string;
  columns?: IColumn[];
}

export interface IUnit {
  unit_id?: string;
  unit_name?: string;
  rows?: IRow[];
}

export interface IWarehouse {
  name?: string;
  address?: string;
  location?: string;
  tags?: string[];
  units?: IUnit[];
}

// Mongoose Sub-Schemas
const ColumnSchema = new Schema<IColumn>(
  {
    column_id: { type: String },
    column_name: { type: String },
    assigned_item_id: { type: String, default: null },
    item_info: {
      name: { type: String },
      sku: { type: String },
    },
  },
  { _id: false }
);

const RowSchema = new Schema<IRow>(
  {
    row_id: { type: String },
    row_name: { type: String },
    columns: { type: [ColumnSchema] },
  },
  { _id: false }
);

const UnitSchema = new Schema<IUnit>(
  {
    unit_id: { type: String },
    unit_name: { type: String },
    rows: { type: [RowSchema] },
  },
  { _id: false }
);

const WarehouseSchema = new Schema<IWarehouse>(
  {
    name: { type: String },
    address: { type: String },
    location: { type: String },
    tags: { type: [String] },
    units: { type: [UnitSchema] },
  },
  { timestamps: true }
);

// Document interface
export interface IWarehouseDocument extends IWarehouse, Document {}

// Model
const WarehouseModel =
  mongoose.models.Warehouse ||
  mongoose.model<IWarehouseDocument>("Warehouse", WarehouseSchema);

export default WarehouseModel;
