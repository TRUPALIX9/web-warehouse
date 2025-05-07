import { Types } from "mongoose";

// Sub-type: Dimensions
export type TDimensions = {
  length?: number;
  width?: number;
  height?: number;
  weight?: number;
};

// Sub-type: StorageLocation
export type TStorageLocation = {
  warehouse_id: Types.ObjectId;
  unit_name?: string;
  row_name?: string;
  column_name?: string;
};

// Main Item Type
export type IItems = {
  _id?: Types.ObjectId;
  name: string;
  category?: string;
  sku: string;
  quantity: number;
  unit_price: number;
  hold_units?: number;
  tags?: string[];
  dimensions?: TDimensions;
  storage_location: TStorageLocation;
  createdAt?: Date;
  updatedAt?: Date;
};
