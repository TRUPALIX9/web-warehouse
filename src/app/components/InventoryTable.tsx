// /src/components/InventoryTable.tsx
'use client';
import MaterialReactTable from 'material-react-table';

const data = [
  { id: 1, name: "Widget A", status: "Available" },
  { id: 2, name: "Widget B", status: "Out of Stock" },
];

const columns = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Product Name",
    Cell: ({ cell }: any) => <strong>{cell.getValue()}</strong>,
  },
  {
    accessorKey: "status",
    header: "Status",
    Cell: ({ cell }: any) => {
      const status = cell.getValue();
      return (
        <span
          className={`px-2 py-1 rounded text-white text-xs ${
            status === "Available" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {status}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    Cell: ({ row }: any) => (
      <button
        onClick={() => alert(`Editing ID ${row.original.id}`)}
        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
      >
        Edit
      </button>
    ),
  },
];

export default function InventoryTable() {
  return (
    <MaterialReactTable
      columns={columns}
      data={data}
      enableGlobalFilter
      muiSearchTextFieldProps={{ placeholder: "Search inventory..." }}
    />
  );
}
