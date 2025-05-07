"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Box,
  Chip,
  TextField,
  Typography,
  Paper,
  Tooltip,
  Button,
} from "@mui/material";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import axios from "axios";
import { useLoading } from "../context/LoadingContext";

type InventoryItem = {
  _id: string;
  name: string;
  sku: string;
  category?: string;
  quantity: number;
  hold_units: number;
  unit_price: number;
  dimensions: {
    length?: number;
    width?: number;
    height?: number;
    weight?: number;
  };
  storage_location: {
    warehouse_name?: string;
    unit_name?: string;
    row_name?: string;
    column_name?: string;
  };
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

export default function InventoryPage() {
  const [data, setData] = useState<InventoryItem[]>([]);
  const [filteredData, setFilteredData] = useState<InventoryItem[]>([]);
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const { setLoading } = useLoading();

  useEffect(() => {
    setLoading(true);
    axios
      .get("/api/inventory")
      .then((res) => {
        setData(res.data.items || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = [...data];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.sku.toLowerCase().includes(q)
      );
    }
    if (tagFilter) {
      result = result.filter((item) => item.tags?.includes(tagFilter));
    }
    setFilteredData(result);
  }, [search, tagFilter, data]);

  const columns: MRT_ColumnDef<InventoryItem>[] = [
    { accessorKey: "name", header: "Name" },
    {
      accessorKey: "sku",
      header: "SKU",
      Cell: ({ row }) => (
        <Tooltip title="View Item Details">
          <Link href={`/items/${row.original._id}`} passHref>
            <Box
              component="span"
              sx={{
                color: "primary.main",
                cursor: "pointer",
                textDecoration: "underline",
                "&:hover": { opacity: 0.8 },
              }}
            >
              {row.original.sku}
            </Box>
          </Link>
        </Tooltip>
      ),
    },
    { accessorKey: "category", header: "Category" },
    { accessorKey: "quantity", header: "Quantity" },
    { accessorKey: "hold_units", header: "Hold Units" },
    {
      accessorKey: "unit_price",
      header: "Unit Price",
      Cell: ({ cell }) => `$${cell.getValue<number>().toFixed(2)}`,
    },
    {
      header: "Dimensions (L x W x H in)",
      accessorFn: (row) =>
        `${row.dimensions?.length || 0} x ${row.dimensions?.width || 0} x ${
          row.dimensions?.height || 0
        }`,
    },
    {
      header: "Weight (lb)",
      accessorFn: (row) => row.dimensions?.weight || "N/A",
    },
    {
      header: "Storage Location",
      accessorFn: (row) => {
        const { warehouse_name, unit_name, row_name, column_name } =
          row.storage_location || {};
        return `${warehouse_name || "N/A"} / ${unit_name || "N/A"} / ${
          row_name || "N/A"
        } / ${column_name || "N/A"}`;
      },
    },
    {
      accessorKey: "tags",
      header: "Tags",
      enableSorting: false,
      Cell: ({ cell }) => {
        const tags = cell.getValue() as string[];
        return (
          <Box display="flex" flexWrap="wrap" gap={0.5}>
            {tags?.map((tag: string) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                onClick={() => setTagFilter(tag)}
                color={tagFilter === tag ? "primary" : "default"}
                sx={{ cursor: "pointer" }}
              />
            ))}
          </Box>
        );
      },
    },
  ];

  return (
    <Box p={4}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" fontWeight="bold">
          Inventory
        </Typography>
        <Link href="/items/new" passHref>
          <Button variant="contained" color="primary">
            Add New Item
          </Button>
        </Link>
      </Box>

      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          label="Search by name or SKU"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
        />
      </Paper>

      {tagFilter && (
        <Chip
          label={`Filter: ${tagFilter}`}
          onDelete={() => setTagFilter(null)}
          color="primary"
          sx={{ mb: 2 }}
        />
      )}

      <MaterialReactTable
        columns={columns}
        data={filteredData}
        enablePagination
      />
    </Box>
  );
}
