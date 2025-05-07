"use client";
import React from "react";
import { Backdrop, CircularProgress } from "@mui/material";
import { useLoading } from "../context/LoadingContext";

// Global Loader Component
export default function GlobalLoader() {
  const { loading } = useLoading();
  return (
    <Backdrop open={loading} sx={{ zIndex: 1301, color: "#fff" }}>
      <CircularProgress size="3rem" />
    </Backdrop>
  );
}
