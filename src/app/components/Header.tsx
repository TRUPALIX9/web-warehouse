"use client";

import { AppBar, Toolbar, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "#6B4F31",
        boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
        zIndex: 1201, // Higher than sidebar
      }}
    >
      <Toolbar
        sx={{
          px: 6,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Left Side: Project Title */}
        <Typography
          variant="h5"
          onClick={() => router.push("/")}
          sx={{
            color: "white",
            fontWeight: "bold",
            letterSpacing: "0.05em",
            cursor: "pointer",
            "&:hover": {
              opacity: 0.8,
            },
            transition: "all 0.3s",
          }}
        >
          Web Warehouse
        </Typography>

        {/* Right Side: Username */}
        <Typography
          variant="body1"
          sx={{
            color: "white",
            fontWeight: "600",
            fontSize: "0.9rem",
          }}
        >
          A DEMO USER
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
