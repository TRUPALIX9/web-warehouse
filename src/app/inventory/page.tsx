'use client';

import { useEffect, useState } from 'react';
import {
  MaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';
import { Box, Chip, CircularProgress, TextField, Typography } from '@mui/material';
import axios from 'axios';

type InventoryItem = {
  _id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  tags: string[];
};

export default function InventoryPage() {
  const [data, setData] = useState<InventoryItem[]>([]);
  const [search, setSearch] = useState('');
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get('/api/inventory', {
          params: { search, tag: tagFilter },
        });
        setData(res.data);
      } catch (err: any) {
        setError(err.message || 'Something went wrong.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [search, tagFilter]);

  const columns: MRT_ColumnDef<InventoryItem>[] = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'sku', header: 'SKU' },
    { accessorKey: 'category', header: 'Category' },
    { accessorKey: 'quantity', header: 'Quantity' },
    {
      accessorKey: 'tags',
      header: 'Tags',
      enableSorting: false,
      Cell: ({ cell }) => (
        <Box display="flex" gap={1} flexWrap="wrap">
          {cell.getValue()?.map((tag: string) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              onClick={() => setTagFilter(tag)}
              sx={{ cursor: 'pointer' }}
            />
          ))}
        </Box>
      ),
    },
  ];

  return (
    <Box p={4}>
      <Typography variant="h4" mb={3}>
        View Inventory
      </Typography>

      <TextField
        fullWidth
        label="Search by Name or SKU"
        variant="outlined"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 2 }}
      />

      {tagFilter && (
        <Chip
          label={`Filter: ${tagFilter}`}
          onDelete={() => setTagFilter(null)}
          sx={{ mb: 2 }}
        />
      )}

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <MaterialReactTable columns={columns} data={data} />
      )}
    </Box>
  );
}
