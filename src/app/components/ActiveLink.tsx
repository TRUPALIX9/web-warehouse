"use client";

import { usePathname } from "next/navigation";
import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";

interface ActiveLinkProps {
  href: string;
  label: string;
  Icon: React.ElementType;
}

export default function ActiveLink({ href, label, Icon }: ActiveLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <ListItemButton
      component="a"
      href={href}
      className={`rounded-lg ${isActive ? "bg-blue-100" : "hover:bg-blue-50"}`}
    >
      <ListItemIcon>
        <Icon className="text-blue-600" />
      </ListItemIcon>
      <ListItemText primary={label} />
    </ListItemButton>
  );
}
