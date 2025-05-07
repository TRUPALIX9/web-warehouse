"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Stack,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Fab,
} from "@mui/material";
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
} from "material-react-table";
import RefreshIcon from "@mui/icons-material/Refresh";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import PurchaseOrderMetaModal from "../components/PurchaseOrderMetaModal";
import Link from "next/link";

interface PurchaseOrder {
  _id: string;
  order_date: string;
  status: string;
  isVendor: boolean;
  party_id: {
    name: string;
    contact_info?: {
      email?: string;
      phone?: string;
    };
  };
  items: {
    item_id: {
      name: string;
      sku: string;
      unit_price: number;
    };
    quantity_ordered: number;
    received_quantity: number;
  }[];
  pallets: {
    pallet_name: string;
    pallet_type: string;
    dimensions: {
      length_in: number;
      width_in: number;
      height_in: number;
    };
    stacking_items: {
      name: string;
      sku: string;
    }[];
  }[];
}

export default function PurchaseOrdersPage() {
  const [incomingData, setIncomingData] = useState<PurchaseOrder[]>([]);
  const [outgoingData, setOutgoingData] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editData, setEditData] = useState<PurchaseOrder | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    const res = await fetch("/api/purchase-orders");
    const json = await res.json();
    setIncomingData(json.incoming);
    setOutgoingData(json.outgoing);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const columns = useMemo<MRT_ColumnDef<PurchaseOrder>[]>(
    () => [
      {
        accessorKey: "_id",
        header: "PO Number",
        Cell: ({ cell }) => (
          <Link
            href={`/purchase-orders/${cell.getValue<string>()}`}
            style={{ color: "#1976d2", textDecoration: "underline" }}
          >
            {cell.getValue<string>()}
          </Link>
        ),
      },
      {
        accessorFn: (row) => row.party_id?.name || "N/A",
        id: "partyName",
        header: "Party Name",
      },
      // {
      //   accessorFn: (row) =>
      //     row.isVendor ? "Vendor (Outgoing)" : "Supplier (Incoming)",
      //   id: "type",
      //   header: "Type",
      // },
      {
        accessorKey: "status",
        header: "Status",
        Cell: ({ cell }) => (
          <Chip
            label={cell.getValue()}
            color={cell.getValue() === "Open" ? "success" : "default"}
          />
        ),
      },
      {
        accessorKey: "order_date",
        header: "Order Date",
        Cell: ({ cell }) =>
          new Date(cell.getValue<string>()).toLocaleDateString(),
      },
      {
        accessorFn: (row) => row.items.length,
        id: "itemsCount",
        header: "Total Items",
      },
      // {
      //   accessorFn: (row) => row.pallets.length,
      //   id: "palletsCount",
      //   header: "Pallets",
      // },
    ],
    []
  );

  const handleDelete = async (row: MRT_Row<PurchaseOrder>) => {
    if (!confirm("Delete this order?")) return;

    await fetch(`/api/purchase-orders/${row.original._id}`, {
      method: "DELETE",
    });

    fetchOrders();
  };

  const renderTable = (
    title: string,
    rows: PurchaseOrder[],
    tableKey: string
  ) => (
    <Box key={tableKey} mt={4}>
      <Stack direction="row" justifyContent="space-between" mb={2}>
        <Typography variant="h5" fontWeight="bold">
          {title}
        </Typography>
        <Tooltip title="Refresh">
          <IconButton onClick={fetchOrders} disabled={loading}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Stack>

      <MaterialReactTable
        columns={columns}
        data={rows}
        enableRowActions
        renderRowActions={({ row }) => (
          <Box display="flex" gap="0.5rem">
            <Tooltip title="Delete">
              <IconButton color="error" onClick={() => handleDelete(row)}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        )}
        initialState={{ pagination: { pageSize: 10, pageIndex: 0 } }}
        muiTablePaperProps={{ sx: { p: 2 } }}
        state={{ isLoading: loading }}
      />
    </Box>
  );

  return (
    <Box p={4}>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        Purchase Orders
      </Typography>

      {renderTable("Supplier PO", incomingData, "incoming")}
      {renderTable("Vendor PO", outgoingData, "outgoing")}

      <PurchaseOrderMetaModal
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEditData(null);
        }}
        onSave={async (meta) => {
          const method = editData ? "PUT" : "POST";
          const url = editData
            ? `/api/purchase-orders/${editData._id}`
            : "/api/purchase-orders";
          const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(meta),
          });
          if (res.ok) fetchOrders();
          setDialogOpen(false);
          setEditData(null);
        }}
        initialData={editData || undefined}
      />

      <Fab
        color="primary"
        onClick={() => {
          setEditData(null);
          setDialogOpen(true);
        }}
        sx={{ position: "fixed", bottom: 24, right: 24 }}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
}
