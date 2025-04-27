'use client';

import { useEffect, useState } from 'react';
import { Box, Grid, Card, CardContent, Typography } from '@mui/material';
import ApexCharts from 'react-apexcharts';

export default function DashboardPage() {
  const [stats, setStats] = useState({ items: 0, purchaseOrders: 0, lowStock: 0, pallets: 0 });
  const [chartData, setChartData] = useState({ inbound: [], outbound: [], months: [] });

  useEffect(() => {
    fetch('/api/dashboard/stats')
      .then((res) => res.json())
      .then((data) => setStats(data));

    fetch('/api/dashboard/insights')
      .then((res) => res.json())
      .then((data) => setChartData(data));
  }, []);

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {[
          { title: 'Total Items', value: stats.items },
          { title: 'Open Purchase Orders', value: stats.purchaseOrders },
          { title: 'Low Stock Items', value: stats.lowStock },
          { title: 'Total Pallets', value: stats.pallets },
        ].map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1" color="textSecondary">
                  {stat.title}
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box mt={6}>
        <Typography variant="h5" mb={2}>
          Stock Movement
        </Typography>
        <ApexCharts
          type="line"
          height={300}
          options={{
            chart: { id: 'stock-movement' },
            xaxis: { categories: chartData.months },
          }}
          series={[
            { name: 'Inbound', data: chartData.inbound },
            { name: 'Outbound', data: chartData.outbound },
          ]}
        />
      </Box>
    </Box>
  );
}
