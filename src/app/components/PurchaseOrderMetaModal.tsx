"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Stack,
} from "@mui/material";
import { useEffect, useState } from "react";

interface Party {
  _id: string;
  name: string;
  isVendor: boolean;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (meta: {
    isVendor: boolean;
    status: string;
    order_date: string;
    party_id: string;
  }) => void;
  initialData?: {
    isVendor: boolean;
    status: string;
    order_date: string;
    party_id: string;
  };
}

const statusOptions = ["Open", "In Progress", "Completed", "Cancelled"];

export default function PurchaseOrderMetaModal({
  open,
  onClose,
  onSave,
  initialData,
}: Props) {
  const [form, setForm] = useState({
    isVendor: true,
    status: "Open",
    order_date: new Date().toISOString().slice(0, 10),
    party_id: "",
  });

  const [parties, setParties] = useState<Party[]>([]);

  const handleChange = (field: keyof typeof form, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === "isVendor") setForm((prev) => ({ ...prev, party_id: "" }));
  };

  const fetchParties = async () => {
    const res = await fetch("/api/party");
    const data: Party[] = await res.json();
    setParties(data);
  };

  useEffect(() => {
    fetchParties();
  }, []);

  useEffect(() => {
    if (initialData) {
      setForm({
        isVendor: initialData.isVendor,
        status: initialData.status,
        order_date: initialData.order_date.slice(0, 10),
        party_id: initialData.party_id,
      });
    }
  }, [initialData]);

  const partyOptions = parties.filter((p) => p.isVendor === form.isVendor);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Purchase Order Details</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Party Type"
            select
            fullWidth
            value={form.isVendor ? "vendor" : "supplier"}
            onChange={(e) =>
              handleChange("isVendor", e.target.value === "vendor")
            }
          >
            <MenuItem value="vendor">Vendor (Outgoing)</MenuItem>
            <MenuItem value="supplier">Supplier (Incoming)</MenuItem>
          </TextField>

          <TextField
            select
            label="Status"
            value={form.status}
            onChange={(e) => handleChange("status", e.target.value)}
            fullWidth
          >
            {statusOptions.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Order Date"
            type="date"
            value={form.order_date}
            onChange={(e) => handleChange("order_date", e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            select
            label={form.isVendor ? "Vendor" : "Supplier"}
            value={form.party_id}
            onChange={(e) => handleChange("party_id", e.target.value)}
            fullWidth
          >
            {partyOptions.length > 0 ? (
              partyOptions.map((p) => (
                <MenuItem key={p._id} value={p._id}>
                  {p.name}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>
                No {form.isVendor ? "vendors" : "suppliers"} available
              </MenuItem>
            )}
          </TextField>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={() => {
            onSave(form);
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
