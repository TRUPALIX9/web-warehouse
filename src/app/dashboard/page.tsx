"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Divider,
} from "@mui/material";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";

// ✅ Dynamically import ApexCharts to avoid SSR crash
const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });

interface Stats {
  items: number;
  purchaseOrders: number;
  lowStock: number;
  pallets: number;
  vendors: number;
  customers: number;
  warehouses: number;
}

interface Insights {
  months: string[];
  inbound: number[];
  outbound: number[];
}

interface InsightRow {
  month: string;
  inbound: number;
  outbound: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [insights, setInsights] = useState<Insights | null>(null);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((data) => {
        setStats(data.stats);
        setInsights(data.insights);
      })
      .catch((err) => console.error("Failed to fetch dashboard data:", err));
  }, []);

  const insightTableColumns: MRT_ColumnDef<InsightRow>[] = [
    { accessorKey: "month", header: "Month" },
    { accessorKey: "inbound", header: "Inbound Orders" },
    { accessorKey: "outbound", header: "Outbound Orders" },
  ];

  const insightTableData: InsightRow[] =
    insights?.months.map((month, i) => ({
      month,
      inbound: insights.inbound[i],
      outbound: insights.outbound[i],
    })) || [];

  return (
    <Box p={4}>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        Warehouse Management Dashboard
      </Typography>

      <Grid container spacing={3}>
        {stats &&
          Object.entries({
            "Total Items": stats.items,
            "Open Purchase Orders": stats.purchaseOrders,
            "Low Stock Items": stats.lowStock,
            "Total Pallets": stats.pallets,
            Vendors: stats.vendors,
            Customers: stats.customers,
            Warehouses: stats.warehouses,
          }).map(([title, value]) => (
            <Grid item xs={12} sm={6} md={3} key={title}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary">
                    {title}
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>

      {insights && (
        <>
          <Divider sx={{ my: 5 }} />

          <Typography variant="h5" fontWeight="medium" mb={2}>
            Stock Movement (Last 6 Months)
          </Typography>

          <ApexCharts
            type="bar"
            height={300}
            options={{
              chart: { id: "stock-movement-chart" },
              xaxis: { categories: insights.months },
              plotOptions: { bar: { horizontal: false } },
              dataLabels: { enabled: false },
              legend: { position: "top" },
              tooltip: { shared: true, intersect: false },
            }}
            series={[
              { name: "Inbound", data: insights.inbound },
              { name: "Outbound", data: insights.outbound },
            ]}
          />

          <Divider sx={{ my: 5 }} />

          <Typography variant="h5" fontWeight="medium" mb={2}>
            Detailed Monthly Summary
          </Typography>

          <MaterialReactTable
            columns={insightTableColumns}
            data={insightTableData}
            enablePagination
            enableSorting
          />
        </>
      )}
    </Box>
  );
}
