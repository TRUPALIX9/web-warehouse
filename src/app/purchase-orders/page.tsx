'use client';

import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';

type PurchaseOrder = {
  id: string;
  vendor: string;
  status: string;
  createdAt: string;
  expectedDelivery: string;
  totalItems: number;
};

export default function PurchaseOrdersPage() {
  const [data, setData] = useState<PurchaseOrder[]>([]);

  useEffect(() => {
    fetch('/api/purchase-orders')
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  const columns: MRT_ColumnDef<PurchaseOrder>[] = [
    { accessorKey: 'id', header: 'PO Number' },
    { accessorKey: 'vendor', header: 'Vendor' },
    { accessorKey: 'status', header: 'Status' },
    { accessorKey: 'createdAt', header: 'Created At' },
    { accessorKey: 'expectedDelivery', header: 'Expected Delivery' },
    { accessorKey: 'totalItems', header: 'Total Items' },
  ];

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        Purchase Orders
      </Typography>

      <MaterialReactTable columns={columns} data={data} />
    </Box>
  );
}
