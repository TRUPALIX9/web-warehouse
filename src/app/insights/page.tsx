'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';

// Dynamic import ApexCharts to fix "window is not defined" error
const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function InsightsPage() {
  const [insightsData, setInsightsData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/insights')
      .then((res) => res.json())
      .then((data) => setInsightsData(data));
  }, []);

  if (!insightsData) {
    return <Typography>Loading Insights...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        Insights
      </Typography>

      <Grid container spacing={4}>
        {/* Inbound vs Outbound Line Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>
                Inbound vs Outbound (Monthly)
              </Typography>
              <ApexCharts
                type="line"
                height={300}
                options={{
                  chart: { id: 'stock-line' },
                  xaxis: { categories: insightsData.months },
                  stroke: { curve: 'smooth' },
                }}
                series={[
                  { name: 'Inbound', data: insightsData.inbound },
                  { name: 'Outbound', data: insightsData.outbound },
                ]}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* POs Per Vendor Bar Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>
                POs per Vendor
              </Typography>
              <ApexCharts
                type="bar"
                height={300}
                options={{
                  xaxis: { categories: insightsData.vendors },
                  plotOptions: { bar: { borderRadius: 4 } },
                }}
                series={[
                  { name: 'Purchase Orders', data: insightsData.vendorPOCounts },
                ]}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Stock Status Pie Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>
                Stock Status Distribution
              </Typography>
              <ApexCharts
                type="pie"
                height={300}
                options={{
                  labels: ['In Stock', 'Low Stock', 'Out of Stock'],
                }}
                series={insightsData.stockStatus}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* New Items Area Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>
                New Items Added Over Time
              </Typography>
              <ApexCharts
                type="area"
                height={300}
                options={{
                  xaxis: { categories: insightsData.itemAddedMonths },
                  stroke: { curve: 'smooth' },
                }}
                series={[
                  { name: 'New Items', data: insightsData.itemAddedCounts },
                ]}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Purchase Order Status Donut Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>
                Purchase Orders Status
              </Typography>
              <ApexCharts
                type="donut"
                height={300}
                options={{
                  labels: ['Pending', 'Received', 'Cancelled'],
                }}
                series={insightsData.poStatus}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
