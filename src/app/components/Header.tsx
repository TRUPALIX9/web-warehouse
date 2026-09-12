"use client";

import { AppBar, Toolbar, Typography } from "@mui/material";
import Link from "next/link";

export default function Header() {
  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "white",
        boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
        zIndex: 1201,
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
        {/* Left Side: Logo (a real link, so it is keyboard reachable) */}
        <Link href="/" aria-label="Web Warehouse home">
          <img
            src="/home.png"
            alt="Web Warehouse"
            style={{
              height: "40px",
              cursor: "pointer",
              transition: "opacity 0.3s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.opacity = "0.8")}
            onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
          />
        </Link>

        {/* Right Side: Username */}
        <Typography
          variant="body1"
          color="primary"
          sx={{
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
