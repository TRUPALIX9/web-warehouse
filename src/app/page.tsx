// app/dashboard/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Box, Grid, Paper, Typography, CircularProgress } from "@mui/material";
import { useLoading } from "../app/context/LoadingContext";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface Summary {
  totalItems: number;
  totalPOs: number;
  openPOs: number;
  closedPOs: number;
  categories: Record<string, number>;
  itemCountsPerPO: { po: string; count: number }[];
  vendorVsSupplierPOs: { label: string; count: number }[];
  top10BarItems: { name: string; quantity: number }[];
  least10BarItems: { name: string; quantity: number }[];
  poCoverage: { label: string; count: number }[];
}

export default function HomePage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const { loading, setLoading } = useLoading();

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/dashboard/summary");
        const data = await res.json();
        setSummary(data);
      } catch (err) {
        console.error("Failed to fetch dashboard summary:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [setLoading]);

  if (loading || !summary) return <></>;

  const pieSeries = Object.values(summary.categories);
  const pieLabels = Object.keys(summary.categories);
  const barPOs = summary.itemCountsPerPO.map((p) => p.po);
  const barCounts = summary.itemCountsPerPO.map((p) => p.count);
  const donutSeries = summary.poCoverage.map((s) => s.count);
  const donutLabels = summary.poCoverage.map((s) => s.label);
  const top10Labels = summary.top10BarItems.map((s) => s.name);
  const top10Data = summary.top10BarItems.map((s) => s.quantity);
  const least10Labels = summary.least10BarItems.map((s) => s.name);
  const least10Data = summary.least10BarItems.map((s) => s.quantity);
  const vendorLabels = summary.vendorVsSupplierPOs.map((v) => v.label);
  const vendorData = summary.vendorVsSupplierPOs.map((v) => v.count);

  const donutColors = ["#00E396", "#FEB019", "#FF4560", "#775DD0", "#546E7A"];
  const barColors = ["#008FFB"];

  return (
    <Box p={4}>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        Warehouse Management Dashboard
      </Typography>

      <Grid container spacing={3}>
        {[
          { title: "Total Items", value: summary.totalItems },
          { title: "Total POs", value: summary.totalPOs },
          { title: "Open POs", value: summary.openPOs },
          { title: "Closed POs", value: summary.closedPOs },
        ].map(({ title, value }) => (
          <Grid item xs={12} sm={6} md={3} key={title}>
            <Paper elevation={2} sx={{ padding: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                {title}
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                {value}
              </Typography>
            </Paper>
          </Grid>
        ))}

        {[
          // Chart sections
          {
            title: "Item Categories",
            component: (
              <ApexChart
                type="pie"
                series={pieSeries}
                options={{ labels: pieLabels, colors: donutColors }}
                width="100%"
              />
            ),
          },
          {
            title: "PO Item Coverage",
            component: (
              <ApexChart
                type="donut"
                series={donutSeries}
                options={{ labels: donutLabels, colors: donutColors }}
                width="100%"
              />
            ),
          },
          {
            title: "Vendor vs Supplier POs",
            component: (
              <ApexChart
                type="donut"
                series={vendorData}
                options={{
                  labels: vendorLabels,
                  colors: ["#008FFB", "#FF4560"],
                }}
                width="100%"
              />
            ),
          },
          {
            title: "PO-wise Item Counts",
            component: (
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
            ),
          },
          {
            title: "Top 10 Items by Quantity",
            component: (
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
            ),
          },
          {
            title: "Least 10 Items by Quantity",
            component: (
              <ApexChart
                type="bar"
                series={[{ name: "Quantity", data: least10Data }]}
                options={{
                  chart: { id: "least-10-bar" },
                  xaxis: { categories: least10Labels },
                  colors: ["#FF4560"],
                }}
                width="100%"
                height={300}
              />
            ),
          },
        ].map(({ title, component }) => (
          <Grid item xs={12} md={6} key={title}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6">{title}</Typography>
              {component}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
