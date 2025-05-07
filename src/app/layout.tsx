"use client";

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
      <body className="bg-gray-100 min-h-screen overflow-hidden">
        {/* Header */}
        <Header />

        {/* Flex Row: Sidebar + Main Content */}
        <div className="flex pt-16">
          {/* Sidebar */}
          <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Sidebar isHovered={isHovered} />
          </div>

          {/* Main Content with Loader Context */}
          <main
            id="main-content"
            className="flex-1 p-6 h-[calc(100vh-64px)] overflow-y-auto bg-gray-50 transition-all duration-300"
            style={{
              marginLeft: isHovered ? 250 : 50,
              marginTop: 64,
            }}
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
