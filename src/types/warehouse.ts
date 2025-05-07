export interface IColumn {
  column_id: string;
  column_name: string;
  assigned_item_id?: string | null | undefined;
  item_info?: {
    name: string;
    sku: string;
  };
}

export interface IRow {
  row_id: string;
  row_name: string;
  columns: IColumn[];
}

export interface IUnit {
  unit_id: string;
  unit_name: string;
  rows: IRow[];
}

export interface IWarehouse {
  _id?: string;
  name: string;
  address: string;
  location: string;
  tags: string[];
  units: IUnit[];
}
