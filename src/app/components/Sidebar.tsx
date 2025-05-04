"use client";

import React, { useState } from "react";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import InsightsIcon from "@mui/icons-material/Insights";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  isHovered: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isHovered }) => {
  const pathname = usePathname();

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
    { text: "Inventory", icon: <InventoryIcon />, path: "/inventory" },
    {
      text: "Purchase Orders",
      icon: <ReceiptLongIcon />,
      path: "/purchase-orders",
    },
    // { text: 'Pallets', icon: <LocalShippingIcon />, path: '/pallets' },
    // { text: 'Insights', icon: <InsightsIcon />, path: '/insights' },
  ];

  return (
    <Box
      sx={{
        height: "100vh",
        width: isHovered ? 250 : 50,
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        left: 0,
        top: 0,
        bgcolor: "background.paper",
        borderRight: "1px solid #e0e0e0",
        boxShadow: "2px 0 8px rgba(0,0,0,0.08)", // slight heavier shadow
        zIndex: 1000,
      }}
    >
      {/* Logo Section */}
      <Box
        sx={{
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "bold",
          fontSize: 24,
          letterSpacing: 1,
          borderBottom: "1px solid #eee",
        }}
      >
        {isHovered ? "Web Warehouse" : "WW"}
      </Box>

      {/* Menu Items */}
      <List sx={{ flexGrow: 1, py: 2 }}>
        {menuItems.map((item) => {
          const isActive = pathname === item.path;

          return (
            <ListItemButton
              key={item.text}
              component={Link}
              href={item.path}
              disableRipple
              sx={{
                justifyContent: isHovered ? "initial" : "center",
                minHeight: 56,
                px: 2.5,
                borderLeft: isActive
                  ? "4px solid #1976d2"
                  : "4px solid transparent",
                backgroundColor: isActive ? "primary.light" : "inherit",
                "&:hover": {
                  backgroundColor: "primary.light",
                },
                transition: "all 0.3s ease",
              }}
            >
              <Tooltip title={!isHovered ? item.text : ""} placement="right">
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: isHovered ? 2 : "auto",
                    justifyContent: "center",
                    color: isActive ? "primary.main" : "inherit",
                    transition: "color 0.3s ease",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
              </Tooltip>

              {isHovered && (
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: 14,
                    fontWeight: isActive ? "bold" : "normal",
                  }}
                />
              )}
            </ListItemButton>
          );
        })}
      </List>

      {/* Footer */}
      {isHovered && (
        <Box
          sx={{
            p: 2,
            mt: "auto",
            textAlign: "center",
            fontSize: 12,
            color: "text.secondary",
            borderTop: "1px solid #eee",
          }}
        >
          © 2025 Web Warehouse
        </Box>
      )}
    </Box>
  );
};

export default Sidebar;
