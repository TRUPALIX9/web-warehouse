"use client";
import React, { useEffect, useState, useRef } from "react";
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  IconButton,
  Divider,
  Collapse,
  TextField,
  MenuItem,
  Tooltip,
  Switch,
  FormControlLabel,
} from "@mui/material";
import {
  Edit,
  Delete,
  Add,
  ExpandMore,
  ExpandLess,
  Inventory2,
  ViewModule,
  Warehouse,
} from "@mui/icons-material";
import axios from "axios";
import { IWarehouse } from "../../types/warehouse";
import { IItems } from "../../types/items";
import EditWarehouseModal from "../components/EditWarehouseModal";
import { useLoading } from "../context/LoadingContext";

export default function SiteManagerPage() {
  const [warehouses, setWarehouses] = useState<IWarehouse[]>([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState<IWarehouse | null>(
    null
  );
  const [editOpen, setEditOpen] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [expandedStates, setExpandedStates] = useState<boolean[]>([]);
  const [unassignedItems, setUnassignedItems] = useState<IItems[]>([]);
  const [assignMode, setAssignMode] = useState<string | null>(null);
  const { setLoading } = useLoading();
  const expandedRef = useRef<boolean[]>([]);

  useEffect(() => {
    fetchWarehouses(true);
    fetchItems();
  }, []);

  const fetchWarehouses = async (initial = false) => {
    setLoading(true);
    const res = await axios.get("/api/warehouse");
    const updated = res.data as IWarehouse[];
    setWarehouses(updated);
    if (initial) {
      expandedRef.current = new Array(updated.length).fill(false);
      setExpandedStates(expandedRef.current);
    } else {
      setExpandedStates(expandedRef.current);
    }
    setLoading(false);
  };

  const fetchItems = async () => {
    setLoading(true);
    const res = await axios.get("/api/items/unassignedItems");
    setUnassignedItems(res.data);
    setLoading(false);
  };

  const handleAdd = () => {
    setSelectedWarehouse({
      name: "",
      address: "",
      location: "",
      tags: [],
      units: [],
    });
    setIsNew(true);
    setEditOpen(true);
  };

  const handleEdit = (warehouse: IWarehouse) => {
    setSelectedWarehouse(JSON.parse(JSON.stringify(warehouse)));
    setIsNew(false);
    setEditOpen(true);
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    setLoading(true);
    await axios.delete(`/api/warehouse/${id}`);
    await axios.put("/api/items/remove-assignments", { warehouse_id: id });
    await fetchWarehouses();
    await fetchItems();
    setLoading(false);
  };

  const handleChange = (field: string, value: string | string[] | any[]) => {
    if (!selectedWarehouse) return;
    setSelectedWarehouse({ ...selectedWarehouse, [field]: value });
  };

  const handleSave = async () => {
    if (!selectedWarehouse) return;
    setLoading(true);
    if (isNew) {
      await axios.post("/api/warehouse", selectedWarehouse);
    } else {
      await axios.put(
        `/api/warehouse/${selectedWarehouse._id}`,
        selectedWarehouse
      );
    }
    setEditOpen(false);
    await fetchWarehouses();
    setLoading(false);
  };

  const handleAssignItem = async (
    warehouse_id: string,
    unit_id: string,
    row_id: string,
    column_id: string,
    itemId: string | null,
    unit_name?: string,
    row_name?: string,
    column_name?: string
  ) => {
    setLoading(true);
    await axios.put("/api/items/unassign", {
      warehouse_id,
      unit_id,
      row_id,
      column_id,
    });

    if (itemId && itemId !== "") {
      await axios.put("/api/items/assign", {
        itemId,
        warehouse_id,
        unit_id,
        unit_name,
        row_id,
        row_name,
        column_id,
        column_name,
      });
    }
    await fetchWarehouses();
    await fetchItems();
    setLoading(false);
  };

  const smartFill = async (warehouse: IWarehouse) => {
    const remainingItems = [...unassignedItems];
    for (const unit of warehouse.units) {
      for (const row of unit.rows) {
        for (const col of row.columns) {
          if (!col.assigned_item_id && remainingItems.length > 0) {
            const nextItem = remainingItems.pop();
            if (nextItem) {
              await handleAssignItem(
                warehouse._id ?? "",
                unit.unit_id,
                row.row_id,
                col.column_id,
                nextItem._id?.toString() ?? null,
                unit.unit_name,
                row.row_name,
                col.column_name
              );
            }
          }
        }
      }
    }
  };

  const toggleExpand = (index: number) => {
    const newStates = [...expandedRef.current];
    newStates[index] = !newStates[index];
    expandedRef.current = newStates;
    setExpandedStates(newStates);
  };

  const toggleAll = (expand: boolean) => {
    const newStates = new Array(warehouses.length).fill(expand);
    expandedRef.current = newStates;
    setExpandedStates(newStates);
  };

  const renderCustomTree = (index: number) => {
    const wh = warehouses[index];
    return (
      <Box mt={1} pl={2}>
        {wh.units.map((unit, uIdx) => (
          <Box key={`unit-${unit.unit_name || uIdx}`} mb={2}>
            <Typography variant="h6" color="primary.main" fontWeight={600}>
              <ViewModule sx={{ mr: 1 }} fontSize="small" /> Unit{" "}
              {unit.unit_name}
            </Typography>
            {unit.rows.map((row, rIdx) => (
              <Box key={`row-${row.row_name || rIdx}`} mb={1} ml={2}>
                <Typography variant="subtitle1" fontWeight={500}>
                  <Warehouse sx={{ mr: 1 }} fontSize="small" /> Row{" "}
                  {row.row_name}
                </Typography>
                <Box ml={3} display="flex" flexWrap="wrap" gap={2}>
                  {row.columns.map((col, cIdx) => (
                    <Box key={`col-${col.column_name || cIdx}`}>
                      <Tooltip
                        title={col.assigned_item_id ? "Assigned" : "Available"}
                      >
                        <TextField
                          size="small"
                          label={`Col ${col.column_name}`}
                          select
                          disabled={assignMode !== wh._id}
                          value={col.assigned_item_id ?? ""}
                          onChange={(e) =>
                            handleAssignItem(
                              wh._id ?? "",
                              unit.unit_id,
                              row.row_id,
                              col.column_id,
                              e.target.value || null,
                              unit.unit_name,
                              row.row_name,
                              col.column_name
                            )
                          }
                          sx={{ minWidth: 180 }}
                        >
                          <MenuItem value="">
                            <em>Unassigned</em>
                          </MenuItem>
                          {[
                            ...unassignedItems,
                            ...(col.assigned_item_id
                              ? [
                                  {
                                    _id: col.assigned_item_id,
                                    name:
                                      col.item_info?.name ??
                                      "(Currently Assigned)",
                                    sku: col.item_info?.sku ?? "",
                                    quantity: 0,
                                    unit_price: 0,
                                    storage_location: {},
                                  },
                                ]
                              : []),
                          ].map((item) => (
                            <MenuItem
                              key={item._id?.toString()}
                              value={item._id?.toString()}
                            >
                              {item.name} ({item.sku || "SKU"})
                            </MenuItem>
                          ))}
                        </TextField>
                      </Tooltip>
                    </Box>
                  ))}
                </Box>
              </Box>
            ))}
          </Box>
        ))}
        <Box
          mt={2}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Button variant="outlined" onClick={() => smartFill(wh)}>
            Smart Fill
          </Button>
          <Typography variant="caption" color="textSecondary">
            {unassignedItems.length} Unassigned Items Left
          </Typography>
        </Box>
      </Box>
    );
  };

  return (
    <Container maxWidth="lg">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mt={4}
        mb={3}
        pt={2}
      >
        <Typography variant="h4" fontWeight={600} color="primary.dark">
          <Inventory2 sx={{ mr: 1 }} /> Site Managment
        </Typography>
        <Box display="flex" gap={2}>
          <Button variant="outlined" onClick={() => toggleAll(true)}>
            Expand All
          </Button>
          <Button variant="outlined" onClick={() => toggleAll(false)}>
            Collapse All
          </Button>
          <Button variant="contained" startIcon={<Add />} onClick={handleAdd}>
            Add Warehouse
          </Button>
        </Box>
      </Box>
      <Divider />

      {warehouses.map((wh, index) => (
        <Paper key={wh._id?.toString()} sx={{ p: 2, mt: 3 }} elevation={2}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography variant="h6" color="primary.main">
                {wh.name}
              </Typography>
              <Typography variant="body2">{wh.address}</Typography>
              <Typography variant="body2">{wh.location}</Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <FormControlLabel
                control={
                  <Switch
                    checked={assignMode === wh._id}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setAssignMode(
                        e.target.checked ? wh._id?.toString() ?? null : null
                      )
                    }
                  />
                }
                label="Assign Mode"
              />
              <IconButton onClick={() => toggleExpand(index)}>
                {expandedStates[index] ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
              <IconButton onClick={() => handleEdit(wh)} color="primary">
                <Edit />
              </IconButton>
              <IconButton
                color="error"
                onClick={() => handleDelete(wh._id?.toString())}
              >
                <Delete />
              </IconButton>
            </Box>
          </Box>

          <Collapse in={expandedStates[index]} timeout="auto" unmountOnExit>
            {renderCustomTree(index)}
          </Collapse>
        </Paper>
      ))}

      <EditWarehouseModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        warehouse={selectedWarehouse}
        isNew={isNew}
        onChange={handleChange}
        onSave={handleSave}
      />
    </Container>
  );
}
