"use client";

import {
  Box,
  Button,
  Container,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Dialog,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useEffect, useState } from "react";
import axios from "axios";
import PartyFormModal from "../components/PartyFormModal";
import { useLoading } from "../context/LoadingContext"; // Adjust path if needed

type Party = {
  _id?: string;
  name: string;
  contact_info?: {
    phone?: string;
    email?: string;
  };
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postal_code?: string;
  };
  isVendor: boolean;
};

export default function PartyPage() {
  const [parties, setParties] = useState<Party[]>([]);
  const [modalType, setModalType] = useState<"vendor" | "supplier" | null>(
    null
  );
  const [editData, setEditData] = useState<Party | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Party | null>(null);

  const { setLoading } = useLoading();

  const fetchParties = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/party");
      setParties(res.data);
    } catch (err) {
      console.error("Failed to fetch parties", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParties();
  }, []);

  const handleAdd = (type: "vendor" | "supplier") => {
    setEditData(null);
    setModalType(type);
  };

  const handleEdit = (party: Party) => {
    setEditData(party);
    setModalType(party.isVendor ? "vendor" : "supplier");
  };

  const handleDelete = async () => {
    if (!deleteTarget?._id) return;
    try {
      setLoading(true);
      await axios.delete(`/api/party/${deleteTarget._id}`);
      setDeleteTarget(null);
      fetchParties();
    } catch (err) {
      console.error("Delete failed", err);
    } finally {
      setLoading(false);
    }
  };

  const renderTable = (filtered: Party[]) => (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filtered.map((party) => {
            const line1 = party.address?.street || "";
            const line2 = [
              party.address?.city,
              party.address?.state,
              party.address?.country,
              party.address?.postal_code,
            ]
              .filter(Boolean)
              .join(", ");

            return (
              <TableRow key={party._id}>
                <TableCell>{party.name}</TableCell>
                <TableCell>{party.contact_info?.phone || "-"}</TableCell>
                <TableCell>{party.contact_info?.email || "-"}</TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2">{line1}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {line2}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(party)}>
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton onClick={() => setDeleteTarget(party)}>
                    <Delete fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const suppliers = parties.filter((p) => !p.isVendor);
  const vendors = parties.filter((p) => p.isVendor);

  return (
    <Container sx={{ mt: 12 }}>
      {/* SUPPLIERS */}
      <Box
        sx={{
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" fontWeight={600}>
          Suppliers
        </Typography>
        <Button variant="contained" onClick={() => handleAdd("supplier")}>
          Add Supplier
        </Button>
      </Box>
      <Paper sx={{ mb: 6, p: 2 }}>
        {suppliers.length > 0 ? (
          renderTable(suppliers)
        ) : (
          <Typography>No suppliers found.</Typography>
        )}
      </Paper>

      {/* VENDORS */}
      <Box
        sx={{
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" fontWeight={600}>
          Vendors
        </Typography>
        <Button variant="contained" onClick={() => handleAdd("vendor")}>
          Add Vendor
        </Button>
      </Box>
      <Paper sx={{ mb: 6, p: 2 }}>
        {vendors.length > 0 ? (
          renderTable(vendors)
        ) : (
          <Typography>No vendors found.</Typography>
        )}
      </Paper>

      {/* MODAL */}
      {modalType && (
        <PartyFormModal
          open={!!modalType}
          type={modalType}
          onClose={() => {
            setModalType(null);
            setEditData(null);
          }}
          onSuccess={fetchParties}
          initialData={editData}
        />
      )}

      {/* DELETE CONFIRMATION */}
      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
        <Box sx={{ px: 3, pt: 3, pb: 2 }}>
          <DialogTitle sx={{ px: 0 }}>
            Are you sure you want to delete{" "}
            <Box component="span" fontWeight="bold">
              {deleteTarget?.name}
            </Box>
            ?
          </DialogTitle>
          <DialogActions sx={{ px: 0, pt: 2 }}>
            <Button onClick={() => setDeleteTarget(null)} variant="outlined">
              Cancel
            </Button>
            <Button color="error" variant="contained" onClick={handleDelete}>
              Delete
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Container>
  );
}
