import { useState } from "react";
import { motion } from "framer-motion";

import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

function MainLayout({
  children,
}) {
  // Mobile Sidebar
  const [
    mobileSidebarOpen,
    setMobileSidebarOpen,
  ] = useState(false);

  // Desktop Sidebar Collapse
  const [
    sidebarCollapsed,
    setSidebarCollapsed,
  ] = useState(false);

  // Toggle Desktop Sidebar
  const toggleSidebar =
    () => {
      setSidebarCollapsed(
        (prev) => !prev
      );
    };

  return (
    <div className="min-h-screen overflow-hidden bg-[#050716] text-slate-100">

      {/* Background */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(109,106,252,0.18),transparent_28%),linear-gradient(135deg,rgba(11,26,60,0.45),rgba(32,19,72,0.28)_44%,rgba(5,7,22,0.92))]" />

      <div className="relative flex min-h-screen">

        {/* Sidebar */}
        <Sidebar
          collapsed={
            sidebarCollapsed
          }
          mobileOpen={
            mobileSidebarOpen
          }
          onCloseMobile={() =>
            setMobileSidebarOpen(
              false
            )
          }
          onToggleCollapse={
            setSidebarCollapsed
          }
        />

        {/* Main Section */}
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">

          {/* Navbar */}
          <motion.div
            initial={{
              opacity: 0,
              y: -10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.25,
            }}
            className="sticky top-0 z-40"
          >

            <Navbar
              onOpenSidebar={() =>
                setMobileSidebarOpen(
                  true
                )
              }
              onToggleSidebar={
                toggleSidebar
              }
            />

          </motion.div>

          {/* Content */}
          <main className="flex-1 overflow-auto px-4 py-5 sm:px-6 lg:px-8">

            <motion.div
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.3,
              }}
              className="mx-auto w-full max-w-[1600px]"
            >
              {children}
            </motion.div>

          </main>

        </div>

      </div>

    </div>
  );
}

export default MainLayout;