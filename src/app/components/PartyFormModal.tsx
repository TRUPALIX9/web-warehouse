"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Box,
  Button,
} from "@mui/material";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useEffect } from "react";

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

interface PartyFormModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  type: "vendor" | "supplier";
  initialData?: Party | null;
}

export default function PartyFormModal({
  open,
  onClose,
  onSuccess,
  type,
  initialData,
}: PartyFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Party>({
    defaultValues: {
      name: "",
      contact_info: {
        phone: "",
        email: "",
      },
      address: {
        street: "",
        city: "",
        state: "",
        country: "",
        postal_code: "",
      },
      isVendor: type === "vendor",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        contact_info: {
          phone: initialData.contact_info?.phone || "",
          email: initialData.contact_info?.email || "",
        },
        address: {
          street: initialData.address?.street || "",
          city: initialData.address?.city || "",
          state: initialData.address?.state || "",
          country: initialData.address?.country || "",
          postal_code: initialData.address?.postal_code || "",
        },
      });
    } else {
      reset({
        name: "",
        contact_info: {
          phone: "",
          email: "",
        },
        address: {
          street: "",
          city: "",
          state: "",
          country: "",
          postal_code: "",
        },
        isVendor: type === "vendor",
      });
    }
  }, [initialData, reset, type]);

  const handleFormSubmit = async (data: Party) => {
    try {
      const isEdit = !!initialData?._id;
      const url = isEdit ? `/api/party/${initialData._id}` : "/api/party";
      const method = isEdit ? "put" : "post";

      await axios[method](url, {
        ...data,
        isVendor: type === "vendor",
      });

      reset();
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Failed to submit party", err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialData ? `Edit ${type}` : `Add ${type}`}</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          onSubmit={handleSubmit(handleFormSubmit)}
          sx={{ mt: 2 }}
        >
          <TextField
            label="Name"
            fullWidth
            {...register("name", { required: "Name is required" })}
            sx={{ mb: 2 }}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
          <TextField
            label="Phone"
            fullWidth
            {...register("contact_info.phone", {
              required: "Phone number is required",
              pattern: {
                value: /^[0-9\-\+\s()]+$/,
                message: "Invalid phone number",
              },
            })}
            sx={{ mb: 2 }}
            error={!!errors.contact_info?.phone}
            helperText={errors.contact_info?.phone?.message}
          />
          <TextField
            label="Email"
            fullWidth
            {...register("contact_info.email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: "Invalid email address",
              },
            })}
            sx={{ mb: 2 }}
            error={!!errors.contact_info?.email}
            helperText={errors.contact_info?.email?.message}
          />
          <TextField
            label="Street"
            fullWidth
            {...register("address.street")}
            sx={{ mb: 2 }}
          />
          <TextField
            label="City"
            fullWidth
            {...register("address.city", { required: "City is required" })}
            sx={{ mb: 2 }}
            error={!!errors.address?.city}
            helperText={errors.address?.city?.message}
          />
          <TextField
            label="State"
            fullWidth
            {...register("address.state", { required: "State is required" })}
            sx={{ mb: 2 }}
            error={!!errors.address?.state}
            helperText={errors.address?.state?.message}
          />
          <TextField
            label="Country"
            fullWidth
            {...register("address.country", {
              required: "Country is required",
            })}
            sx={{ mb: 2 }}
            error={!!errors.address?.country}
            helperText={errors.address?.country?.message}
          />
          <TextField
            label="Postal Code"
            fullWidth
            {...register("address.postal_code")}
            sx={{ mb: 2 }}
          />

          <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={onClose} sx={{ mr: 2 }}>
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              {initialData ? "Update" : "Save"}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
