// src/app/components/InventoryList.tsx
"use client"
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '..mui/material';
import { InventoryItem } from '../../types/types';  // Import the type

const InventoryList = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);  // Type the inventory state

  useEffect(() => {
    async function fetchInventory() {
      const response = await fetch('/api/inventory');
      const data: InventoryItem[] = await response.json();  // Type the response data
     console.log(data);
      setInventory(data || []);
    }
    fetchInventory();
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="inventory table">
        <TableHead>
          <TableRow>
            <TableCell>SKU Number</TableCell>
            <TableCell>Description</TableCell>
            <TableCell align="right">Inventory</TableCell>
            <TableCell align="right">Height (in)</TableCell>
            <TableCell align="right">Width (in)</TableCell>
            <TableCell align="right">Weight (lb)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {inventory?.map((item) => (
            <TableRow key={item._id}>
              <TableCell component="th" scope="row">
                {item["SKU NUMBER"]}
              </TableCell>
              <TableCell>{item.DESCRIPTION}</TableCell>
              <TableCell align="right">{item.INVENTORY}</TableCell>
              <TableCell align="right">{item["Height (in)"]}</TableCell>
              <TableCell align="right">{item["Width (in)"]}</TableCell>
              <TableCell align="right">{item["Weight (lb)"]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default InventoryList;
