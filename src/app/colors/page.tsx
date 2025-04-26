"use client";

import { Box, Typography, Grid, Paper } from "@mui/material";

const warehouseThemes = [
  {
    name: "Brick Red",
    colors: ["#A83232", "#D15656", "#F2A2A2", "#FDF5F5"],
  },
  {
    name: "Rust Orange",
    colors: ["#B34700", "#E67300", "#FFB266", "#FFF3E0"],
  },
  {
    name: "Mustard Yellow",
    colors: ["#C19A00", "#FFD700", "#FFE680", "#FFF9DB"],
  },
  {
    name: "Olive Green",
    colors: ["#556B2F", "#88AA4D", "#C9E79B", "#F4FCEB"],
  },
  {
    name: "Army Green",
    colors: ["#4B5320", "#6E7F30", "#B4C466", "#F1F8E9"],
  },
  {
    name: "Steel Blue",
    colors: ["#4682B4", "#5A9BD5", "#A7C6ED", "#EAF4FC"],
  },
  {
    name: "Slate Grey",
    colors: ["#708090", "#8899A6", "#C3CBD5", "#F8FAFB"],
  },
  {
    name: "Charcoal",
    colors: ["#36454F", "#556677", "#AAB4C2", "#F1F2F6"],
  },
  {
    name: "Deep Navy",
    colors: ["#1A237E", "#3F51B5", "#9FA8DA", "#E8EAF6"],
  },
  {
    name: "Warehouse Brown",
    colors: ["#5C4033", "#8B5E3C", "#C8A27E", "#F8F1E7"],
  },
  {
    name: "Cement Grey",
    colors: ["#B0B0B0", "#CCCCCC", "#E6E6E6", "#FAFAFA"],
  },
  {
    name: "Dusty Rose",
    colors: ["#B76E79", "#D69DA6", "#F3D2D8", "#FEF5F7"],
  },
];

export default function ColorsPage() {
  return (
    <Box
      component="main"
      sx={{
        mt: 8,
        px: 4,
        py: 2,
        minHeight: "calc(100vh - 64px)",
        backgroundColor: "#f9fafb",
      }}
    >
      <Typography variant="h4" fontWeight="bold" mb={4}>
        Choose Your Warehouse Theme
      </Typography>

      <Grid container spacing={4}>
        {warehouseThemes.map((theme) => (
          <Grid item xs={12} sm={6} md={4} key={theme.name}>
            <Paper
              elevation={3}
              sx={{
                borderRadius: 2,
                overflow: "hidden",
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": { transform: "scale(1.02)", boxShadow: 6 },
              }}
            >
              {/* Show color blocks */}
              <Box display="flex" flexDirection="row" height={100}>
                {theme.colors.map((color) => (
                  <Box key={color} flex={1} bgcolor={color} />
                ))}
              </Box>
              <Box p={2} textAlign="center">
                <Typography variant="subtitle1" fontWeight="bold">
                  {theme.name}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
