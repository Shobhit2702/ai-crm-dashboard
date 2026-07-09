"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileUp,
  ChevronLeft,
  ChevronRight,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Customers", href: "/customers", icon: Users },
  { label: "CSV Import", href: "/csv-import", icon: FileUp },
];

function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const pathname = usePathname();

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between bg-slate-50 text-slate-900 border-r border-slate-100 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-800 transition-all duration-200">
      <div>
        {/* Logo and Header */}
        <div className={cn(
          "flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800",
          collapsed ? "justify-center px-2" : ""
        )}>
          {!collapsed ? (
            <div>
              <span className="font-bold text-lg text-blue-600 dark:text-blue-400 tracking-tight block">
                CRM Suite
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block -mt-1">
                Enterprise Tier
              </span>
            </div>
          ) : (
            <span className="font-extrabold text-xl text-blue-600 dark:text-blue-400 tracking-tight">
              CS
            </span>
          )}

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex items-center justify-center p-1 rounded-md text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            // Handle both exact match and startsWith for subroutes
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group duration-150 relative",
                  isActive
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
                    : "text-slate-500 hover:bg-slate-100/60 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200",
                  collapsed ? "justify-center px-2 tooltip" : ""
                )}
              >
                <Icon className={cn(
                  "h-5 w-5 shrink-0 transition-transform duration-150 group-hover:scale-105",
                  isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500"
                )} />
                {!collapsed && <span>{item.label}</span>}

                {/* Collapsed Tooltip */}
                {collapsed && (
                  <div className="absolute left-14 z-50 rounded-md bg-slate-900 text-white text-xs px-2 py-1 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 shadow-sm whitespace-nowrap dark:bg-slate-100 dark:text-slate-900">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (fixed) */}
      <aside className={cn(
        "hidden md:block fixed top-0 bottom-0 left-0 z-20 transition-all duration-200",
        collapsed ? "w-16" : "w-64"
      )}>
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Sidebar */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity duration-200"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer container */}
          <div className="relative flex w-64 max-w-xs flex-col flex-1 bg-slate-50 dark:bg-slate-900 focus:outline-hidden">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}

export { Sidebar };
