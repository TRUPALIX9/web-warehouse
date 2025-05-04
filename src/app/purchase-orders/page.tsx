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
} from "@mui/material";
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
} from "material-react-table";
import RefreshIcon from "@mui/icons-material/Refresh";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface PurchaseOrder {
  _id: string;
  order_date: string;
  status: string;
  party_id: {
    name: string;
    isVendor: boolean;
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
  const [data, setData] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    const res = await fetch("/api/purchase-orders");
    const json = await res.json();
    setData(json);
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
      },
      {
        accessorFn: (row) => row.party_id?.name || "N/A",
        id: "partyName",
        header: "Party Name",
      },
      {
        accessorFn: (row) => (row.party_id?.isVendor ? "Vendor" : "Customer"),
        id: "type",
        header: "Type",
      },
      {
        accessorKey: "status",
        header: "Status",
        Cell: ({ cell }) => (
          <Chip
            // label={cell.getValue()}
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
      {
        accessorFn: (row) => row.pallets.length,
        id: "palletsCount",
        header: "Pallets",
      },
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

  return (
    <Box p={4}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h4" fontWeight="bold">
          Purchase Orders
        </Typography>
        <Tooltip title="Refresh">
          <IconButton onClick={fetchOrders} disabled={loading}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Stack>

      <MaterialReactTable
        columns={columns}
        data={data}
        enableRowActions
        renderRowActions={({ row }) => (
          <Box display="flex" gap="0.5rem">
            <Tooltip title="Details">
              <IconButton onClick={() => {}}>
                <VisibilityIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton color="error" onClick={() => handleDelete(row)}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        )}
        renderDetailPanel={({ row }) => (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight="bold">Items & Pallets</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box>
                <Typography variant="subtitle1">Items Ordered:</Typography>
                <ul>
                  {row.original.items.map((it, i) => (
                    <li key={i}>
                      {it.item_id.name} ({it.item_id.sku}) —{" "}
                      {it.quantity_ordered} ordered, {it.received_quantity}{" "}
                      received
                    </li>
                  ))}
                </ul>

                <Typography variant="subtitle1" mt={2}>
                  Pallets:
                </Typography>
                <ul>
                  {row.original.pallets.map((p, i) => (
                    <li key={i}>
                      {p.pallet_name} [{p.pallet_type}] —{" "}
                      {p.dimensions.length_in}x{p.dimensions.width_in}x
                      {p.dimensions.height_in} in
                      <ul>
                        {p.stacking_items.map((si, j) => (
                          <li key={j}>
                            - {si.name} ({si.sku})
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </Box>
            </AccordionDetails>
          </Accordion>
        )}
        initialState={{ pagination: { pageSize: 10, pageIndex: 0 } }}
        muiTablePaperProps={{ sx: { p: 2 } }}
        state={{ isLoading: loading }}
      />
    </Box>
  );
}
