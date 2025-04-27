'use client';

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { useState } from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <html lang="en">
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
            <Sidebar isHovered={isHovered} /> {/* Pass hover state */}
          </div>

          {/* Main Content */}
          <main
            id="main-content"
            className="flex-1 p-6 h-[calc(100vh-64px)] overflow-y-auto bg-gray-50 transition-all duration-300"
            style={{
              marginLeft: isHovered ? 250 : 50, // 💥 Dynamic margin
              marginTop:64
            }}
          >
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
