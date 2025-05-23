"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Grid,
  TextField,
  Paper,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import axios from "axios";
import { useLoading } from "../../context/LoadingContext";
import BoxView from "../../components/3dBoxView";

export default function ItemDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { setLoading } = useLoading();
  const [form, setForm] = useState<any>({
    name: "",
    sku: "",
    quantity: 0,
    unit_price: 0,
    hold_units: 0,
    dimensions: { length: 1, width: 1, height: 1, weight: 1 },
  });
  const [editing, setEditing] = useState(!id);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (id) {
          const res = await axios.get(`/api/items/${id}`);
          setForm(res.data);
        }
      } catch (err) {
        console.error("Fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, setLoading]);

  const handleChange = (field: string, value: any) => {
    setForm((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedChange = (group: string, field: string, value: any) => {
    setForm((prev: any) => ({
      ...prev,
      [group]: {
        ...prev[group],
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      if (id) {
        await axios.put(`/api/items/${id}`, form);
      } else {
        const created = await axios.post("/api/items", form);
        const newId = created.data._id;
        router.push(`/items/${newId}`);
      }
      setEditing(false);
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const confirmAndDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/items/${id}`);
      router.push("/inventory");
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const { length = 1, width = 1, height = 1 } = form.dimensions || {};

  return (
    <Box p={4}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={5}>
          <Box mb={2}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              {form.name || "New Item"}
            </Typography>
            {id && (
              <Typography variant="body2" color="text.secondary">
                SKU: {form.sku}
              </Typography>
            )}
          </Box>

          <Box mb={3}>
            <BoxView length={length} width={width} height={height} />
          </Box>

          <Grid container spacing={2}>
            {["length", "width", "height", "weight"].map((dim) => (
              <Grid item xs={6} key={dim}>
                <TextField
                  label={
                    dim === "weight"
                      ? "Weight (lb)"
                      : `${dim.charAt(0).toUpperCase() + dim.slice(1)} (in)`
                  }
                  type="number"
                  value={form.dimensions?.[dim] || ""}
                  onChange={(e) =>
                    handleNestedChange(
                      "dimensions",
                      dim,
                      Number(e.target.value)
                    )
                  }
                  fullWidth
                  disabled={!editing}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={500} gutterBottom>
              {id ? "Item Information" : "Create New Item"}
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Name"
                  value={form.name || ""}
                  onChange={(e) => handleChange("name", e.target.value)}
                  fullWidth
                  disabled={!editing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="SKU"
                  value={form.sku || ""}
                  onChange={(e) => handleChange("sku", e.target.value)}
                  fullWidth
                  disabled={!editing}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Quantity"
                  type="number"
                  value={form.quantity}
                  onChange={(e) =>
                    handleChange("quantity", Number(e.target.value))
                  }
                  fullWidth
                  disabled={!editing}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Unit Price"
                  type="number"
                  value={form.unit_price}
                  onChange={(e) =>
                    handleChange("unit_price", Number(e.target.value))
                  }
                  fullWidth
                  disabled={!editing}
                />
              </Grid>
            </Grid>

            <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
              {editing ? (
                <>
                  <Button
                    variant="outlined"
                    onClick={() =>
                      id ? setEditing(false) : router.push("/items")
                    }
                  >
                    Cancel
                  </Button>
                  <Button variant="contained" onClick={handleSave}>
                    {id ? "Save Changes" : "Create Item"}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outlined"
                    onClick={() => setDeleteDialogOpen(true)}
                    color="error"
                  >
                    Delete Item
                  </Button>
                  <Button variant="contained" onClick={() => setEditing(true)}>
                    Edit Item
                  </Button>
                </>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this item? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={() => {
              setDeleteDialogOpen(false);
              confirmAndDelete();
            }}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
