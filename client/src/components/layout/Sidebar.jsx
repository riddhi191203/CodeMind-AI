import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

import {
  Bug,
  Code2,
  Gauge,
  History,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  User,
  WandSparkles,
  X,
} from "lucide-react";

import { AuthContext } from "../../context/auth-context";
import Brand from "../ui/Brand";

const aiTools = [
  ["Dashboard", LayoutDashboard, "/dashboard"],
  ["Code Review", Code2, "/reviewer"],
  ["Error Solver", Bug, "/error-solver"],
  ["Refactor", WandSparkles, "/refactor"],
  ["Complexity", Gauge, "/complexity"],
];

const workspace = [
  ["Code Editor", Code2, "/editor"],
  ["AI Chat", MessageSquare, "/chat"],
  ["Saved Reports", History, "/history"],
  ["Profile", User, "/profile"],
];

function NavGroup({
  title,
  items,
  collapsed,
  onCloseMobile,
}) {
  const { pathname } =
    useLocation();

  return (
    <div className="space-y-2">

      {!collapsed && (
        <p className="px-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
          {title}
        </p>
      )}

      <nav className="space-y-1">

        {items.map(
          ([name, Icon, path]) => {

            const active =
              pathname === path;

            return (
              <Link
                key={path}
                to={path}
                onClick={onCloseMobile}
                title={
                  collapsed
                    ? name
                    : undefined
                }
                className={`group relative flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition-all duration-200 ${
                  active
                    ? "bg-gradient-to-r from-violet-600/20 to-indigo-500/10 text-white"
                    : "text-slate-300 hover:bg-white/[0.06] hover:text-white"
                } ${
                  collapsed
                    ? "justify-center"
                    : ""
                }`}
              >

                {active && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-2xl border border-violet-400/20"
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                  />
                )}

                <Icon
                  size={19}
                  className={`relative z-10 ${
                    active
                      ? "text-violet-300"
                      : "text-slate-400 group-hover:text-white"
                  }`}
                />

                {!collapsed && (
                  <span className="relative z-10">
                    {name}
                  </span>
                )}

              </Link>
            );
          }
        )}

      </nav>

    </div>
  );
}

function SidebarContent({
  collapsed,
  onCloseMobile,
}) {
  const { logout, user } =
    useContext(AuthContext);

  const { pathname } =
    useLocation();

  const activeName =
    [...aiTools, ...workspace]
      .find(
        ([, , path]) =>
          path === pathname
      )?.[0] || "Workspace";

  const initials =
    user?.name
      ?.split(" ")
      ?.map(
        (item) =>
          item[0]
      )
      ?.join("")
      ?.slice(0, 2)
      ?.toUpperCase() || "U";

  return (
    <div className="flex h-full flex-col justify-between">

      {/* TOP */}
      <div>

        {/* LOGO */}
        <div className="mb-8 flex items-center justify-between">

          <Link
            to="/dashboard"
            onClick={onCloseMobile}
          >

            <motion.div
              whileHover={{
                scale: 1.03,
              }}
            >
              <Brand
                compact={collapsed}
              />
            </motion.div>

          </Link>

          <button
            type="button"
            onClick={onCloseMobile}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-slate-400 hover:bg-white/10 lg:hidden"
          >
            <X size={18} />
          </button>

        </div>

        {/* NAVIGATION */}
        <div className="space-y-8">

          <NavGroup
            title="AI Tools"
            items={aiTools}
            collapsed={collapsed}
            onCloseMobile={onCloseMobile}
          />

          <NavGroup
            title="Workspace"
            items={workspace}
            collapsed={collapsed}
            onCloseMobile={onCloseMobile}
          />

        </div>

      </div>

      {/* BOTTOM */}
      <div className="space-y-4 border-t border-white/10 pt-5">

        {!collapsed && (
          <div className="flex items-center gap-3 rounded-2xl bg-white/[0.04] p-3">

            <div className="brand-gradient flex h-11 w-11 items-center justify-center rounded-full text-sm font-black text-white shadow-lg shadow-violet-950/30">
              {initials}
            </div>

            <div className="min-w-0">

              <p className="truncate text-sm font-bold text-white">
                {user?.name || "User"}
              </p>

              <p className="truncate text-xs text-slate-400">
                {activeName}
              </p>

            </div>

          </div>
        )}

        <button
          type="button"
          onClick={logout}
          title={
            collapsed
              ? "Logout"
              : undefined
          }
          className={`flex w-full items-center gap-3 rounded-2xl border border-red-500/10 px-3 py-3 text-sm font-semibold text-red-300 transition-all duration-200 hover:bg-red-500/10 hover:text-red-200 ${
            collapsed
              ? "justify-center"
              : ""
          }`}
        >

          <LogOut size={18} />

          {!collapsed && (
            <span>
              Logout
            </span>
          )}

        </button>

      </div>

    </div>
  );
}

function Sidebar({
  collapsed,
  mobileOpen,
  onCloseMobile,
  onToggleCollapse,
}) {
  return (
    <>

      {/* DESKTOP */}
      <aside
        onMouseEnter={() => {
          if (collapsed) {
            onToggleCollapse(
              false
            );
          }
        }}
        onMouseLeave={() => {
          if (!collapsed) {
            onToggleCollapse(
              true
            );
          }
        }}
        className={`sticky top-0 hidden h-screen shrink-0 border-r border-white/10 bg-[#050716]/95 px-3 py-4 backdrop-blur-xl transition-all duration-300 lg:block ${
          collapsed
            ? "w-[82px]"
            : "w-[300px]"
        }`}
      >

        <SidebarContent
          collapsed={collapsed}
          onCloseMobile={onCloseMobile}
        />

      </aside>

      {/* MOBILE */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">

          {/* OVERLAY */}
          <button
            type="button"
            aria-label="Close sidebar"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onCloseMobile}
          />

          {/* SIDEBAR */}
          <motion.aside
            initial={{
              x: -320,
            }}
            animate={{
              x: 0,
            }}
            exit={{
              x: -320,
            }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 24,
            }}
            className="relative h-full w-72 border-r border-white/10 bg-[#050716] px-4 py-5 shadow-2xl"
          >

            <SidebarContent
              collapsed={false}
              onCloseMobile={onCloseMobile}
            />

          </motion.aside>

        </div>
      )}

    </>
  );
}

export default Sidebar;