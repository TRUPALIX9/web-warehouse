"use client";
import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  IconButton,
  Chip,
  InputAdornment,
  Divider,
  Paper,
} from "@mui/material";
import { Delete, Add } from "@mui/icons-material";
import { IWarehouse, IUnit, IRow, IColumn } from "../../types/warehouse";

interface EditWarehouseModalProps {
  open: boolean;
  onClose: () => void;
  warehouse: IWarehouse | null;
  isNew?: boolean;
  onChange: (field: string, value: string | string[] | IUnit[]) => void;
  onSave: () => void;
}

const modalStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  maxHeight: "90vh",
  overflowY: "auto",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 4,
  p: 4,
};

const primaryBlue = "#1976d2";

const getNextAlphabet = (existing: string[]): string => {
  const used = new Set(existing);
  for (let i = 0; i < 26 * 2; i++) {
    let label = "";
    let n = i;
    while (true) {
      label = String.fromCharCode(65 + (n % 26)) + label;
      if (n < 26) break;
      n = Math.floor(n / 26) - 1;
    }
    if (!used.has(label)) return label;
  }
  return `X${existing.length + 1}`;
};

const EditWarehouseModal: React.FC<EditWarehouseModalProps> = ({
  open,
  onClose,
  warehouse,
  isNew = false,
  onChange,
  onSave,
}) => {
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [units, setUnits] = useState<IUnit[]>([]);

  useEffect(() => {
    if (warehouse) {
      setTags(warehouse.tags || []);
      setUnits(warehouse.units || []);
    }
  }, [warehouse]);

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      const newTags = [...tags, trimmed];
      setTags(newTags);
      onChange("tags", newTags);
      setTagInput("");
    }
  };

  const removeTag = (index: number) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    setTags(newTags);
    onChange("tags", newTags);
  };

  const updateUnits = (newUnits: IUnit[]) => {
    setUnits(newUnits);
    onChange("units", newUnits);
  };

  const handleAddUnit = () => {
    const nextName = getNextAlphabet(units.map((u) => u.unit_name));
    const newUnit: IUnit = {
      unit_id: `${Date.now()}-${Math.random()}`,
      unit_name: nextName,
      rows: [],
    };
    updateUnits([...units, newUnit]);
  };

  const handleRemoveUnit = (unitIndex: number) => {
    const newUnits = [...units];
    newUnits.splice(unitIndex, 1);
    updateUnits(newUnits);
  };

  const handleUnitChange = (i: number, value: string) => {
    const newUnits = [...units];
    newUnits[i].unit_name = value;
    updateUnits(newUnits);
  };

  const handleAddRow = (unitIndex: number) => {
    const unit = units[unitIndex];
    const nextRowName = getNextAlphabet(unit.rows.map((r) => r.row_name));
    const newRow: IRow = {
      row_id: `${Date.now()}-${Math.random()}`,
      row_name: nextRowName,
      columns: [],
    };
    const newUnits = [...units];
    newUnits[unitIndex].rows.push(newRow);
    updateUnits(newUnits);
  };

  const handleRemoveRow = (unitIndex: number, rowIndex: number) => {
    const newUnits = [...units];
    newUnits[unitIndex].rows.splice(rowIndex, 1);
    updateUnits(newUnits);
  };

  const handleRowChange = (
    unitIndex: number,
    rowIndex: number,
    value: string
  ) => {
    const newUnits = [...units];
    newUnits[unitIndex].rows[rowIndex].row_name = value;
    updateUnits(newUnits);
  };

  const handleAddColumn = (unitIndex: number, rowIndex: number) => {
    const row = units[unitIndex].rows[rowIndex];
    const newColumn: IColumn = {
      column_id: `${Date.now()}-${Math.random()}`,
      column_name: (row.columns.length + 1).toString(),
    };
    const newUnits = [...units];
    newUnits[unitIndex].rows[rowIndex].columns.push(newColumn);
    updateUnits(newUnits);
  };

  const handleRemoveColumn = (
    unitIndex: number,
    rowIndex: number,
    colIndex: number
  ) => {
    const newUnits = [...units];
    newUnits[unitIndex].rows[rowIndex].columns.splice(colIndex, 1);
    updateUnits(newUnits);
  };

  const handleColumnChange = (
    unitIndex: number,
    rowIndex: number,
    colIndex: number,
    value: string
  ) => {
    const newUnits = [...units];
    newUnits[unitIndex].rows[rowIndex].columns[colIndex].column_name = value;
    updateUnits(newUnits);
  };

  if (!warehouse) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h5" fontWeight={600} mb={2} textAlign="center">
          {isNew ? "Add New Warehouse" : "Edit Warehouse"}
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Name"
              name="name"
              value={warehouse.name}
              fullWidth
              onChange={(e) => onChange("name", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Address"
              name="address"
              value={warehouse.address}
              fullWidth
              onChange={(e) => onChange("address", e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Location"
              name="location"
              value={warehouse.location}
              fullWidth
              onChange={(e) => onChange("location", e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Add Tag"
              value={tagInput}
              fullWidth
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button variant="outlined" size="small" onClick={addTag}>
                      Add
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
            <Box mt={1} display="flex" flexWrap="wrap" gap={1}>
              {tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  onDelete={() => removeTag(index)}
                  variant="outlined"
                  color="primary"
                />
              ))}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              sx={{ backgroundColor: primaryBlue }}
              startIcon={<Add />}
              onClick={handleAddUnit}
            >
              Add Unit
            </Button>
          </Grid>

          {units.map((unit, i) => (
            <Paper
              key={unit.unit_id}
              variant="outlined"
              sx={{ mt: 4, p: 2, width: "100%" }}
            >
              <Box width="100%">
                <Box display="flex" alignItems="center" gap={1} width="100%">
                  <TextField
                    label={`Unit ${i + 1} Name`}
                    value={unit.unit_name}
                    fullWidth
                    onChange={(e) => handleUnitChange(i, e.target.value)}
                  />
                  <IconButton color="error" onClick={() => handleRemoveUnit(i)}>
                    <Delete />
                  </IconButton>
                </Box>
                <Box display="flex" gap={2} flexWrap="wrap" my={2}>
                  <Button
                    size="small"
                    startIcon={<Add />}
                    onClick={() => handleAddRow(i)}
                    sx={{ backgroundColor: primaryBlue, color: "white" }}
                  >
                    Add Row
                  </Button>
                </Box>
                {unit.rows.map((row, j) => (
                  <Box key={row.row_id} mt={2} width="100%">
                    <Box
                      display="flex"
                      alignItems="center"
                      gap={1}
                      width="100%"
                    >
                      <TextField
                        label={`Row ${j + 1}`}
                        value={row.row_name}
                        fullWidth
                        onChange={(e) => handleRowChange(i, j, e.target.value)}
                      />
                      <Box display="flex" gap={1}>
                        <Button
                          size="small"
                          startIcon={<Add />}
                          onClick={() => handleAddColumn(i, j)}
                          sx={{
                            backgroundColor: primaryBlue,
                            color: "white",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Add Column
                        </Button>
                        <IconButton
                          color="error"
                          onClick={() => handleRemoveRow(i, j)}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </Box>
                    <Grid container spacing={1} mt={1} pl={2}>
                      {row.columns.map((col, k) => (
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={4}
                          lg={3}
                          key={col.column_id}
                        >
                          <Box display="flex" alignItems="center" gap={1}>
                            <TextField
                              label={`Col ${k + 1}`}
                              value={col.column_name}
                              fullWidth
                              onChange={(e) =>
                                handleColumnChange(i, j, k, e.target.value)
                              }
                            />
                            <IconButton
                              color="error"
                              onClick={() => handleRemoveColumn(i, j, k)}
                            >
                              <Delete />
                            </IconButton>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                ))}
              </Box>
            </Paper>
          ))}
        </Grid>

        <Box display="flex" justifyContent="flex-end" mt={5} gap={2}>
          <Button variant="outlined" color="inherit" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={onSave}>
            {isNew ? "Create" : "Save"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditWarehouseModal;
