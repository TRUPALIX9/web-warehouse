"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Divider,
  Chip,
  List,
  ListItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useLoading } from "../../context/LoadingContext";

export default function PurchaseOrderDetailPage() {
  const params = useParams();
  const id = useMemo(
    () => (Array.isArray(params.id) ? params.id[0] : params.id),
    [params]
  );
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const { setLoading } = useLoading();
  const [searchQuery, setSearchQuery] = useState("");
  const [inventoryItems, setInventoryItems] = useState<any[]>([]);
  const [editable, setEditable] = useState(false);
  const [editedItems, setEditedItems] = useState<any[]>([]);
  const [calculatedPallets, setCalculatedPallets] = useState<any[]>([]);
  const [confirmDialog, setConfirmDialog] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/purchase-orders/${id}`);
        if (!res.ok) throw new Error("Failed to fetch order");
        const json = await res.json();
        setData(json);
        setEditedItems(json.items);
        setCalculatedPallets(json.pallets || []);
      } catch (err) {
        console.error("Fetch error:", err);
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, setLoading]);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await fetch("/api/inventory");
        const json = await res.json();
        setInventoryItems(json.items || []);
      } catch (err) {
        console.error("Failed to fetch inventory:", err);
      }
    };
    fetchInventory();
  }, []);

  const handleSave = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/purchase-orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: editedItems,
          pallets: calculatedPallets,
        }),
      });
      if (!res.ok) throw new Error("Failed to update purchase order");
      const updated = await res.json();
      setData(updated);
      setEditable(false);
    } catch (err) {
      console.error("Update error:", err);
    } finally {
      setLoading(false);
    }
  };

  const palletCapacity = 48 * 40 * 60;
  const totalCost = useMemo(
    () =>
      editedItems.reduce((sum, e) => {
        const matched = inventoryItems.find(
          (item) => (e.item_id?._id || e.item_id) === item._id
        );
        return sum + (e.quantity_ordered || 0) * (matched?.unit_price || 0);
      }, 0),
    [editedItems, inventoryItems]
  );

  const totalVolume = useMemo(
    () =>
      editedItems.reduce((sum, e) => {
        const matched = inventoryItems.find(
          (item) => (e.item_id?._id || e.item_id) === item._id
        );
        const dims = matched?.dimensions;
        if (!dims) return sum;
        return (
          sum +
          dims.length * dims.width * dims.height * (e.quantity_ordered || 0)
        );
      }, 0),
    [editedItems, inventoryItems]
  );

  const totalWeight = useMemo(
    () =>
      editedItems.reduce((sum, e) => {
        const matched = inventoryItems.find(
          (item) => (e.item_id?._id || e.item_id) === item._id
        );
        return (
          sum + (matched?.dimensions?.weight || 0) * (e.quantity_ordered || 0)
        );
      }, 0),
    [editedItems, inventoryItems]
  );

  const estimatedPallets = useMemo(
    () => (totalVolume > 0 ? Math.ceil(totalVolume / palletCapacity) : 0),
    [totalVolume]
  );

  const handleMarkComplete = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/purchase-orders/${id}/complete`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: editedItems }),
      });
      if (!res.ok) throw new Error("Failed to complete PO");
      const updated = await res.json();
      setData(updated);
      setEditable(false);
    } catch (err) {
      console.error("Complete PO error:", err);
    } finally {
      setLoading(false);
      setConfirmDialog(false);
    }
  };

  const calculatePallets = () => {
    const palletList = [];
    let currentVolume = 0;
    let currentPallet = {
      pallet_name: `Pallet 1`,
      pallet_type: "Standard",
      dimensions: { length_in: 48, width_in: 40, height_in: 60 },
      stacking_items: [] as any[],
    };
    for (const item of editedItems) {
      const fullItem = inventoryItems.find(
        (i) => (item.item_id?._id || item.item_id) === i._id
      );
      if (!fullItem || !fullItem.dimensions) continue;
      const itemVolume =
        fullItem.dimensions.length *
        fullItem.dimensions.width *
        fullItem.dimensions.height;
      const qty = item.quantity_ordered || 0;
      for (let i = 0; i < qty; i++) {
        if (currentVolume + itemVolume > palletCapacity) {
          palletList.push(currentPallet);
          currentPallet = {
            pallet_name: `Pallet ${palletList.length + 1}`,
            pallet_type: "Standard",
            dimensions: { length_in: 48, width_in: 40, height_in: 60 },
            stacking_items: [],
          };
          currentVolume = 0;
        }
        currentPallet.stacking_items.push({
          name: fullItem.name,
          sku: fullItem.sku,
          storage_location: fullItem.storage_location || null,
        });
        currentVolume += itemVolume;
      }
    }
    if (currentPallet.stacking_items.length > 0) {
      palletList.push(currentPallet);
    }
    setCalculatedPallets(palletList);
  };

  if (!data) return <Typography>No data found</Typography>;

  const visibleItems = editable
    ? inventoryItems
    : editedItems
        .map((e) => {
          const item = inventoryItems.find(
            (i) => (e.item_id?._id || e.item_id) === i._id
          );
          return item ? { ...item, orderedQty: e.quantity_ordered } : null;
        })
        .filter(Boolean);

  return (
    <Box p={4} maxWidth={1000} mx="auto">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Purchase Order #{" "}
          <Button
            variant="text"
            size="small"
            onClick={() => router.push(`/purchase-orders/${data._id}`)}
            sx={{ textTransform: "none", fontWeight: "bold", ml: 1 }}
          >
            {data._id}
          </Button>
        </Typography>
        {editable && (
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
          >
            Save Changes
          </Button>
        )}
        <Button
          variant="outlined"
          color="success"
          startIcon={<CheckCircleIcon />}
          onClick={handleMarkComplete}
        >
          Mark as Complete
        </Button>
        <IconButton onClick={() => setEditable(!editable)} sx={{ ml: 2 }}>
          <EditIcon />
        </IconButton>
      </Box>
      {/* Remaining JSX unchanged for brevity */}

      <Dialog open={confirmDialog} onClose={() => setConfirmDialog(false)}>
        <DialogTitle>Confirm Completion</DialogTitle>
        <DialogContent>
          Are you sure you want to mark this PO as completed? This will deduct
          inventory quantities.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(false)}>Cancel</Button>
          <Button
            onClick={handleMarkComplete}
            variant="contained"
            color="success"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Chip
        label={data.status}
        color={data.status === "Open" ? "success" : "default"}
        sx={{ mb: 2 }}
      />

      <Typography variant="subtitle1" gutterBottom>
        Order Date: {new Date(data.order_date).toLocaleDateString()}
      </Typography>

      <Typography variant="subtitle1" gutterBottom>
        Party: {data.party_id?.name || "N/A"} (
        {data.isVendor ? "Vendor" : "Supplier"})
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" gutterBottom>
        Summary:
      </Typography>
      <Typography variant="body2">
        Total Volume: {totalVolume.toLocaleString()} in³
      </Typography>
      <Typography variant="body2">
        Total Weight: {totalWeight.toLocaleString()} lbs
      </Typography>
      <Typography variant="body2">
        Total Cost: $
        {totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </Typography>
      <Typography variant="body2">
        Estimated Pallets Needed: {estimatedPallets}
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" gutterBottom>
        Items:
      </Typography>
      {/* 
      <TextField
        placeholder="Search item by name or SKU"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        fullWidth
        size="small"
        sx={{ mb: 2 }}
      /> */}

      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>SKU</TableCell>
              <TableCell>Ordered</TableCell>
              <TableCell>Unit Price</TableCell>
              <TableCell>Subtotal</TableCell>
              <TableCell>Storage Location</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleItems.map((item: any) => {
              const match = editedItems.find(
                (i) => (i.item_id?._id || i.item_id) === item._id
              );
              const orderedQty =
                match?.quantity_ordered || item.orderedQty || 0;

              const location = item.storage_location;
              const locationText = location
                ? `${location.unit_name || ""} / ${location.row_name || ""} / ${
                    location.column_name || ""
                  }`
                : "N/A";

              return (
                <TableRow key={item._id} hover>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.sku}</TableCell>
                  <TableCell>
                    {editable ? (
                      <TextField
                        type="number"
                        size="small"
                        value={orderedQty}
                        onChange={(e) => {
                          const qty = parseInt(e.target.value) || 0;
                          const updated = editedItems.filter(
                            (i) => (i.item_id?._id || i.item_id) !== item._id
                          );
                          if (qty > 0)
                            updated.push({
                              item_id: item._id,
                              quantity_ordered: qty,
                              received_quantity: 0,
                            });
                          setEditedItems(updated);
                        }}
                        sx={{ width: 80 }}
                      />
                    ) : (
                      orderedQty
                    )}
                  </TableCell>
                  <TableCell>
                    ${item.unit_price?.toFixed(2) || "0.00"}
                  </TableCell>
                  <TableCell>
                    ${(orderedQty * (item.unit_price || 0)).toFixed(2)}
                  </TableCell>
                  <TableCell>{locationText}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {editable && (
        <Button variant="contained" onClick={calculatePallets} sx={{ mb: 3 }}>
          Calculate Pallets
        </Button>
      )}

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" gutterBottom>
        Pallets:
      </Typography>
      <List dense>
        {calculatedPallets.map((p: any, i: number) => {
          const skuCounts: Record<string, { name: string; count: number }> = {};
          p.stacking_items.forEach((item: any) => {
            if (skuCounts[item.sku]) {
              skuCounts[item.sku].count += 1;
            } else {
              skuCounts[item.sku] = { name: item.name, count: 1 };
            }
          });

          return (
            <ListItem key={i} alignItems="flex-start">
              <Box width="100%">
                <Typography variant="subtitle1" fontWeight="bold">
                  {`${p.pallet_name} [${p.pallet_type}] - ${p.dimensions.length_in}x${p.dimensions.width_in}x${p.dimensions.height_in} in`}
                </Typography>
                <TableContainer component={Paper} sx={{ mt: 1, mb: 2 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Item Name</TableCell>
                        <TableCell>SKU</TableCell>
                        <TableCell>Count</TableCell>
                        <TableCell>Location</TableCell> {/* new column */}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.entries(skuCounts).map(
                        ([sku, { name, count }]) => {
                          // Get example location for display
                          const sampleItem = p.stacking_items.find(
                            (s: any) => s.sku === sku
                          );
                          const loc = sampleItem?.storage_location;
                          const locText = loc
                            ? `${loc.unit_name || ""} / ${
                                loc.row_name || ""
                              } / ${loc.column_name || ""}`
                            : "N/A";

                          return (
                            <TableRow key={sku}>
                              <TableCell>{name}</TableCell>
                              <TableCell>{sku}</TableCell>
                              <TableCell>{count}</TableCell>
                              <TableCell>{locText}</TableCell>
                            </TableRow>
                          );
                        }
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
}
