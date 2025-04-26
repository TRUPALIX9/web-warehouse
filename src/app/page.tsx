"use client";

import { Box, Typography, Paper, Grid } from "@mui/material";

export default function HomePage() {
  return (
    <Box
      component="main"
      sx={{
        mt: 8, // ✅ margin-top: 64px to start below the fixed Header
        px: 4, // padding left/right for nice spacing
        py: 2,
        minHeight: "calc(100vh - 64px)", // full viewport height minus header
        backgroundColor: "#f9fafb", // soft gray background
      }}
    >
      {/* Page Title */}
      <Typography variant="h4" fontWeight="bold" color="text.primary" mb={4}>
        Warehouse Inventory Dashboard
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3}>
        {/* Total Items Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Total Items
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              1,240
            </Typography>
          </Paper>
        </Grid>

        {/* Pending Orders Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Pending Orders
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              65
            </Typography>
          </Paper>
        </Grid>

        {/* Vendors Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Vendors
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              23
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
