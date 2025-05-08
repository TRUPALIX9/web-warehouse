// app/dashboard/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Box, Grid, Paper, Typography, Divider } from "@mui/material";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface Summary {
  totalItems: number;
  totalPOs: number;
  openPOs: number;
  closedPOs: number;
  categories: Record<string, number>;
  itemCountsPerPO: { po: string; count: number }[];
  vendorVsSupplierPOs: { label: string; count: number }[];
  topStockedItems: { name: string; quantity: number }[];
  top10BarItems: { name: string; quantity: number }[];
  poCoverage: { label: string; count: number }[];
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<Summary | null>(null);

  useEffect(() => {
    fetch("/api/dashboard/summary")
      .then((res) => res.json())
      .then(setSummary)
      .catch(console.error);
  }, []);

  if (!summary) return <div>Loading...</div>;

  const pieSeries = Object.values(summary.categories);
  const pieLabels = Object.keys(summary.categories);

  const barPOs = summary.itemCountsPerPO.map((p) => p.po);
  const barCounts = summary.itemCountsPerPO.map((p) => p.count);

  const donutSeries = summary.poCoverage.map((s) => s.count);
  const donutLabels = summary.poCoverage.map((s) => s.label);

  const stockLabels = summary.topStockedItems.map((s) => s.name);
  const stockData = summary.topStockedItems.map((s) => s.quantity);

  const top10Labels = summary.top10BarItems.map((s) => s.name);
  const top10Data = summary.top10BarItems.map((s) => s.quantity);

  const vendorLabels = summary.vendorVsSupplierPOs.map((v) => v.label);
  const vendorData = summary.vendorVsSupplierPOs.map((v) => v.count);

  const donutColors = ["#00E396", "#FEB019", "#FF4560", "#775DD0", "#546E7A"];
  const barColors = ["#008FFB"];

  const insightTableColumns: MRT_ColumnDef<{
    name: string;
    quantity: number;
  }>[] = [
    { accessorKey: "name", header: "Item Name" },
    { accessorKey: "quantity", header: "Quantity" },
  ];

  return (
    <Box p={4}>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        Warehouse Management Dashboard
      </Typography>

      <Grid container spacing={3}>
        {["Total Items", "Total POs", "Open POs", "Closed POs"].map(
          (title, i) => (
            <Grid item xs={12} sm={6} md={3} key={title}>
              <Paper elevation={2} sx={{ padding: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {title}
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {
                    [
                      summary.totalItems,
                      summary.totalPOs,
                      summary.openPOs,
                      summary.closedPOs,
                    ][i]
                  }
                </Typography>
              </Paper>
            </Grid>
          )
        )}

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6">Item Categories</Typography>
            <ApexChart
              type="pie"
              series={pieSeries}
              options={{ labels: pieLabels, colors: donutColors }}
              width="100%"
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6">PO Item Coverage</Typography>
            <ApexChart
              type="donut"
              series={donutSeries}
              options={{ labels: donutLabels, colors: donutColors }}
              width="100%"
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6">Vendor vs Supplier POs</Typography>
            <ApexChart
              type="donut"
              series={vendorData}
              options={{ labels: vendorLabels, colors: ["#008FFB", "#FF4560"] }}
              width="100%"
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6">PO-wise Item Counts</Typography>
            <ApexChart
              type="bar"
              series={[{ name: "Items", data: barCounts }]}
              options={{
                chart: { id: "po-bar" },
                xaxis: { categories: barPOs },
                colors: barColors,
              }}
              width="100%"
              height={300}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={12}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6">Top 10 Items by Quantity</Typography>
            <ApexChart
              type="bar"
              series={[{ name: "Quantity", data: top10Data }]}
              options={{
                chart: { id: "top-10-bar" },
                xaxis: { categories: top10Labels },
                colors: ["#FEB019"],
              }}
              width="100%"
              height={300}
            />
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ my: 4 }} />
          <Typography variant="h6" mb={2}>
            Top Stocked Items
          </Typography>
          <MaterialReactTable
            columns={insightTableColumns}
            data={summary.topStockedItems}
            enablePagination
            enableSorting
            muiTableBodyRowProps={{ hover: true }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
