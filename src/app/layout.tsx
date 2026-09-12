"use client";

import "./globals.css";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { useState } from "react";
import { LoadingProvider } from "./context/LoadingContext";
import GlobalLoader from "./components/GlobalLoader";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <html lang="en">
      <head>
        <title>Web Warehouse</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" href="/logo.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Smart Inventory System" />
      </head>
      <body className="min-h-screen overflow-hidden">
        {/* Header */}
        <Header />

        {/* Flex Row: Sidebar + Main Content (pt-16 clears the 64px AppBar) */}
        <div className="flex pt-16">
          {/* Sidebar: expands on hover or keyboard focus and overlays the page */}
          <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onFocus={() => setIsHovered(true)}
            onBlur={() => setIsHovered(false)}
          >
            <Sidebar isHovered={isHovered} />
          </div>

          {/* Main Content with Loader Context; the page ground comes from globals.css */}
          <main
            id="main-content"
            className="flex-1 h-[calc(100vh-64px)] overflow-y-auto"
            style={{ marginLeft: 50 }}
          >
            <LoadingProvider>
              <GlobalLoader />
              {children}
            </LoadingProvider>
          </main>
        </div>
      </body>
    </html>
  );
}
