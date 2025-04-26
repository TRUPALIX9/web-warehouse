// "use client";

// import { Box, Typography, Grid, Paper } from "@mui/material";

// const warehouseWebsiteThemes = [
//   { name: "Earthy Warehouse", colors: ["#6B4F31", "#A0937D", "#3E4C59", "#BFC5C7"] },
//   { name: "Cargo Mix", colors: ["#B29F7E", "#5D6D7E", "#A3B18A", "#DAD7CD"] },
//   { name: "Industrial Modern", colors: ["#2E3A59", "#6C7A89", "#8DA399", "#E6E8E6"] },
//   { name: "Steel Factory", colors: ["#3E4E5E", "#748CAB", "#A1B5D8", "#DDE6ED"] },
//   { name: "Rust and Olive", colors: ["#8B5E3C", "#6B8E23", "#9E9E9E", "#EEECEB"] },
//   { name: "Shipping Bay", colors: ["#355070", "#6D597A", "#B56576", "#E56B6F"] },
//   { name: "Twilight Loading Dock", colors: ["#3D405B", "#81B29A", "#F2CC8F", "#E07A5F"] },
//   { name: "Crate Brown", colors: ["#8B4513", "#DEB887", "#A9A9A9", "#F5F5F5"] },
//   { name: "Military Precision", colors: ["#556B2F", "#708238", "#A0C49D", "#D6D58E"] },
//   { name: "Concrete Jungle", colors: ["#555555", "#777777", "#999999", "#E5E5E5"] },
//   { name: "Equipment Teal", colors: ["#2C7A7B", "#468189", "#77ACA2", "#B5C9C3"] },
//   { name: "Storage Bay", colors: ["#5D576B", "#8896AB", "#C6D0E3", "#F4F7FA"] },
//   { name: "Weathered Wall", colors: ["#7C7C7C", "#9E9E9E", "#D4D4D4", "#F5F5F5"] },
//   { name: "Workshop Red Steel", colors: ["#B22222", "#607D8B", "#AAB7B8", "#ECECEC"] },
//   { name: "Cement Floor", colors: ["#A0A0A0", "#CCCCCC", "#EFEFEF", "#FFFFFF"] },
//   { name: "Shipping Crate", colors: ["#A0522D", "#CD853F", "#F5DEB3", "#FAF3E0"] },
//   { name: "Forklift Yellow", colors: ["#E1B000", "#FFC857", "#FFD580", "#FFF1D0"] },
//   { name: "Warehouse Canvas", colors: ["#7A6C5D", "#B09E91", "#D5CBC4", "#F5F0EC"] },
//   { name: "Heavy Duty Grey", colors: ["#616161", "#9E9E9E", "#BDBDBD", "#E0E0E0"] },
//   { name: "Olive Branch", colors: ["#708238", "#9DB17C", "#C5DCA0", "#F0F5E4"] },
//   { name: "Loading Dock", colors: ["#2F4858", "#33658A", "#86BBD8", "#F6AE2D"] },
//   { name: "Foundry Heat", colors: ["#B23A48", "#FF7043", "#FFA07A", "#FFDAB9"] },
//   { name: "Pallet Stack", colors: ["#8E6E53", "#B5A287", "#E0D7C1", "#FAF8F3"] },
//   { name: "Warehouse Fog", colors: ["#808080", "#A9A9A9", "#D3D3D3", "#F5F5F5"] },
//   { name: "Broken Stone", colors: ["#5B5B5B", "#7D7D7D", "#9F9F9F", "#C1C1C1"] },
//   { name: "Port Dock", colors: ["#1F3B4D", "#406E8E", "#8FB8DE", "#D2E4F2"] },
//   { name: "Stormy Sky", colors: ["#3E4C59", "#62757F", "#9FA9B1", "#D4D9DC"] },
//   { name: "Equipment Yellow", colors: ["#E0C068", "#FFF275", "#FFF9A6", "#FFFDD0"] },
//   { name: "Bunker Brown", colors: ["#5C4033", "#7B5E44", "#A1866F", "#C9B6A3"] },
//   { name: "Tarp Canvas", colors: ["#5A6B64", "#7C9184", "#A5B3A6", "#D7D9D0"] },
//   { name: "Welded Steel", colors: ["#44494D", "#6A737D", "#9CA3AF", "#D1D5DB"] },
//   { name: "Corrugated Grey", colors: ["#727272", "#999999", "#BFBFBF", "#E6E6E6"] },
//   { name: "Warehouse Rust", colors: ["#824C38", "#B35C44", "#DA7964", "#F7B7A3"] },
//   { name: "Aged Timber", colors: ["#6B4226", "#936639", "#C8A165", "#E6D3B3"] },
//   { name: "Metal Surface", colors: ["#5E6D7B", "#8FA6B8", "#C2D4E4", "#EEF2F5"] },
//   { name: "Empty Dock", colors: ["#585858", "#7A7A7A", "#9B9B9B", "#BCBCBC"] },
//   { name: "Warehouse Fabric", colors: ["#8B7969", "#B9A191", "#DDC4B8", "#F5EDE7"] },
//   { name: "Shipping Brown", colors: ["#7D5A50", "#AD8A75", "#D7BBA4", "#F5E9DF"] },
//   { name: "Tarmac Grey", colors: ["#555555", "#777777", "#999999", "#BBBBBB"] },
//   { name: "Olive Crate", colors: ["#718355", "#A0B084", "#CFE2B4", "#F0F7DF"] },
//   { name: "Navy Load", colors: ["#1B1B2F", "#162447", "#1F4068", "#1B98E0"] },
//   { name: "Industrial Harbor", colors: ["#2D4059", "#EA5455", "#F9ED69", "#F07B3F"] },
//   { name: "Foundry Ash", colors: ["#494949", "#727272", "#AAAAAA", "#DDDDDD"] },
//   { name: "Forklift Track", colors: ["#BFAA5C", "#F1C232", "#FFF07C", "#FFFACD"] },
//   { name: "Tarp Brown", colors: ["#805D42", "#B4886B", "#D9B7A2", "#F8E8DC"] },
//   { name: "Warehouse Cement", colors: ["#858585", "#A9A9A9", "#CCCCCC", "#ECECEC"] },
//   { name: "Storage Unit", colors: ["#7F8C8D", "#95A5A6", "#BDC3C7", "#ECF0F1"] },
// ];


// export default function ColorsPage() {
//   return (
//     <Box
//       component="main"
//       sx={{
//         mt: 8,
//         px: 4,
//         py: 2,
//         minHeight: "calc(100vh - 64px)",
//         backgroundColor: "#f9fafb",
//       }}
//     >
//       <Typography variant="h4" fontWeight="bold" mb={4}>
//         Warehouse Project Color Palettes
//       </Typography>

//       <Grid container spacing={4}>
//         {warehouseWebsiteThemes.map((theme) => (
//           <Grid item xs={12} sm={6} md={4} key={theme.name}>
//             <Paper
//               elevation={3}
//               sx={{
//                 borderRadius: 2,
//                 overflow: "hidden",
//                 cursor: "pointer",
//                 transition: "all 0.3s ease",
//                 "&:hover": { transform: "scale(1.02)", boxShadow: 6 },
//               }}
//             >
//               <Box height={32} bgcolor={theme.colors[0]} />
//               <Box display="flex" flexDirection="row" height={100}>
//                 {theme.colors.map((color) => (
//                   <Box key={color} flex={1} bgcolor={color} />
//                 ))}
//               </Box>
//               <Box p={2} textAlign="center">
//                 <Typography variant="subtitle1" fontWeight="bold">
//                   {theme.name}
//                 </Typography>
//               </Box>
//             </Paper>
//           </Grid>
//         ))}
//       </Grid>
//     </Box>
//   );
// }
"use client";

import { Box, Typography, Grid, Paper, Button ,Chip} from "@mui/material";

const warehouseUISchemes = [
  {
    name: "Neutral Olive",
    background: "#F7F9F7",
    button: "#0077CC",
    header: "#2F3B3E",
    accent: "#7DA87B",
  },
  {
    name: "Concrete White",
    background: "#FAFAFA",
    button: "#1E88E5",
    header: "#37474F",
    accent: "#90A4AE",
  },
  {
    name: "Warehouse Sand",
    background: "#F5F3EB",
    button: "#2196F3",
    header: "#263238",
    accent: "#A1887F",
  },
  {
    name: "Dusty Canvas",
    background: "#F4F2ED",
    button: "#1976D2",
    header: "#1C2833",
    accent: "#B0BEC5",
  },
  {
    name: "Olive Tarp",
    background: "#EFF2EB",
    button: "#1565C0",
    header: "#2E3A59",
    accent: "#9CAF88",
  },
  {
    name: "Muted Stone",
    background: "#F8F8F8",
    button: "#0088CC",
    header: "#37474F",
    accent: "#BCAAA4",
  },
  {
    name: "Foggy Grey",
    background: "#F2F2F2",
    button: "#3399FF",
    header: "#263238",
    accent: "#B0BEC5",
  },
  {
    name: "Steel Air",
    background: "#FAFBFC",
    button: "#1976D2",
    header: "#2C3E50",
    accent: "#90CAF9",
  },
  {
    name: "Warehouse Sky",
    background: "#F5F7FA",
    button: "#0D47A1",
    header: "#1A1A1A",
    accent: "#7986CB",
  },
  {
    name: "Pale Olive",
    background: "#F6F7F3",
    button: "#1E88E5",
    header: "#263238",
    accent: "#A3B18A",
  },
  {
    name: "Warm Ash",
    background: "#F4F4F4",
    button: "#2196F3",
    header: "#3E4C59",
    accent: "#B39DDB",
  },
  {
    name: "Urban Grey",
    background: "#F0F0F0",
    button: "#3498DB",
    header: "#2F3640",
    accent: "#BDC3C7",
  },
  {
    name: "Dawn Mist",
    background: "#F9FAFB",
    button: "#0288D1",
    header: "#263238",
    accent: "#80DEEA",
  },
  {
    name: "Rustic White",
    background: "#FAFAF5",
    button: "#03A9F4",
    header: "#263238",
    accent: "#FFB74D",
  },
  {
    name: "Shale Grey",
    background: "#F3F4F6",
    button: "#1A73E8",
    header: "#263238",
    accent: "#64B5F6",
  },
  {
    name: "Warehouse Ice",
    background: "#F8FBFD",
    button: "#00AEEF",
    header: "#2B3E50",
    accent: "#B2EBF2",
  },
  {
    name: "Alabaster Olive",
    background: "#F6F9F5",
    button: "#005BBB",
    header: "#1F2937",
    accent: "#9DBE8C",
  },
  {
    name: "Workshop Light",
    background: "#FDFDFD",
    button: "#2196F3",
    header: "#263238",
    accent: "#A5D6A7",
  },
  {
    name: "Rolling Fog",
    background: "#F3F5F7",
    button: "#0D8BF2",
    header: "#33475B",
    accent: "#AED581",
  },
  {
    name: "Shipping Deck",
    background: "#FAFAFA",
    button: "#1976D2",
    header: "#212121",
    accent: "#F48FB1",
  },
  {
    name: "Olive Grey",
    background: "#F5F6F4",
    button: "#0288D1",
    header: "#263238",
    accent: "#81C784",
  },
  {
    name: "Dock Mist",
    background: "#EFF0F3",
    button: "#2196F3",
    header: "#263238",
    accent: "#CE93D8",
  },
  {
    name: "Dusted Canvas",
    background: "#F9F9F9",
    button: "#1E88E5",
    header: "#212121",
    accent: "#80CBC4",
  },
  {
    name: "Warehouse Breeze",
    background: "#FAFAFC",
    button: "#1565C0",
    header: "#263238",
    accent: "#B3E5FC",
  },
  {
    name: "Crate White",
    background: "#F7F9FB",
    button: "#1976D2",
    header: "#263238",
    accent: "#DCE775",
  },
  {
    name: "Steel Light",
    background: "#FAFAFA",
    button: "#0D47A1",
    header: "#212121",
    accent: "#AED581",
  },
  {
    name: "Tarmac Frost",
    background: "#EFF2F7",
    button: "#1E88E5",
    header: "#263238",
    accent: "#B0BEC5",
  },
  {
    name: "Cold Concrete",
    background: "#F6F7F9",
    button: "#1976D2",
    header: "#1F2937",
    accent: "#FFB74D",
  },
  {
    name: "Empty Dock",
    background: "#F5F7F8",
    button: "#03A9F4",
    header: "#263238",
    accent: "#FF7043",
  },
  {
    name: "Warehouse Cloud",
    background: "#F9F9FB",
    button: "#2196F3",
    header: "#263238",
    accent: "#CE93D8",
  },
    // Amazon-like: Orange header, blue accent
    {
      name: "Amazon Inspired",
      header: "#FF9900",     // Amazon Orange
      button: "#146EB4",     // Amazon Blue
      background: "#FAFAFA",
      accent: "#232F3E",     // Dark navy for icons
    },
  
    // Light Brown + Soft Olive
    {
      name: "Warehouse Classic",
      header: "#8B5E3C",     // Brown Header
      button: "#3B7A57",     // Olive Green Button
      background: "#F9F9F6",
      accent: "#A3B18A",     // Soft Olive Accent
    },
  
    // Blue Industrial Portal
    {
      name: "Industrial Blue",
      header: "#1E3A8A",     // Dark Blue Header
      button: "#3B82F6",     // Light Blue Button
      background: "#F0F4F8",
      accent: "#64748B",     // Muted Steel Accent
    },
  
    // Dark Blue Admin Panel
    {
      name: "Deep Navy Admin",
      header: "#0A192F",     // Very Dark Blue Header
      button: "#1E90FF",     // Bright Blue Button
      background: "#F7FAFC",
      accent: "#48CAE4",     // Cyan Accent
    },
  
    // Soft Beige Business Portal
    {
      name: "Business Beige",
      header: "#D6C4A8",     // Soft Beige Header
      button: "#A98467",     // Coffee Button
      background: "#F5F2EC",
      accent: "#8D6748",     // Darker coffee accent
    },
  
    // Olive Dark Warehouse
    {
      name: "Olive Storage",
      header: "#556B2F",     // Dark Olive
      button: "#6B8E23",     // Brighter Olive
      background: "#F7F9F5",
      accent: "#A3B18A",
    },
  
    // Slate Grey Modern
    {
      name: "Modern Grey",
      header: "#37474F",     // Slate Dark Header
      button: "#607D8B",     // Blue Grey Button
      background: "#ECEFF1",
      accent: "#90A4AE",
    },
  
    // Classic Steel Blue
    {
      name: "Steel Factory",
      header: "#2B3A67",     // Dark Steel Blue
      button: "#3F51B5",     // Normal Steel Blue
      background: "#F2F5FA",
      accent: "#7986CB",
    },
  
    // Black & Yellow Caution theme
    {
      name: "Caution Warehouse",
      header: "#000000",     // Black Header
      button: "#FFCC00",     // Caution Yellow Button
      background: "#FDFDFD",
      accent: "#FFD700",
    },
  
    // Teal Warehouse Calm
    {
      name: "Teal Calm",
      header: "#006D77",     // Dark Teal
      button: "#83C5BE",     // Light Teal Button
      background: "#EDF6F9",
      accent: "#00B4D8",     // Bright Cyan Accent
    },
  
    // Dark Olive + Light Cement
    {
      name: "Olive Cement",
      header: "#4B5320",     // Dark Army Olive
      button: "#9BA17B",     // Light Olive Button
      background: "#F5F5F5",
      accent: "#D6D58E",     // Soft Cement Accent
    },
  
    // Deep Grey Portal
    {
      name: "Deep Grey Admin",
      header: "#2F3640",     // Very Dark Grey Header
      button: "#40739E",     // Soft Blue Button
      background: "#F0F0F0",
      accent: "#718093",
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
        Warehouse UI Color Schemes Demo
      </Typography>

      <Grid container spacing={4}>
        {warehouseUISchemes.map((theme) => (
          <Grid item xs={12} sm={6} md={4} key={theme.name}>
            <Paper
              elevation={3}
              sx={{
                borderRadius: 2,
                overflow: "hidden",
                bgcolor: theme.background,
                transition: "all 0.3s ease",
                "&:hover": { transform: "scale(1.02)", boxShadow: 6 },
              }}
            >
              {/* Header Preview */}
              <Box
                sx={{
                  bgcolor: theme.header,
                  p: 2,
                  textAlign: "center",
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold" color="white">
                  Header
                </Typography>
              </Box>

              {/* Body */}
              <Box p={3} display="flex" flexDirection="column" alignItems="center" gap={2}>
                {/* Button Preview */}
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: theme.button,
                    color: "white",
                    "&:hover": {
                      bgcolor: theme.button,
                    },
                  }}
                >
                  Button
                </Button>

                {/* Accent Preview */}
                <Chip
                  label="Accent"
                  sx={{
                    bgcolor: theme.accent,
                    color: "#fff",
                    fontWeight: "bold",
                  }}
                />
              </Box>

              {/* Theme Name */}
              <Box p={2} textAlign="center">
                <Typography variant="subtitle2" fontWeight="bold" color="text.primary">
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
