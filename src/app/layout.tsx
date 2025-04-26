import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen overflow-hidden">
        {/* Header on top */}
        <Header />

        {/* Flex Row: Sidebar + Main Content */}
        <div className="flex pt-16">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <main
            id="main-content"
            className="flex-1 ml-20 p-6 h-[calc(100vh-64px)] overflow-y-auto bg-gray-50 transition-all duration-300"
          >
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
