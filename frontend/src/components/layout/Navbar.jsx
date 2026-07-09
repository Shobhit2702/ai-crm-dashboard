"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search, Bell, HelpCircle, Menu, Moon, Sun, Settings, LogOut } from "lucide-react";
import { Dropdown, DropdownItem, DropdownSeparator } from "@/components/ui/dropdown";
import { useTheme } from "@/context/ThemeContext";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

function Navbar({ collapsed, setMobileOpen }) {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  // Get active tab name for mobile header or display breadcrumbs
  const getPageTitle = () => {
    if (pathname.startsWith("/customers")) return "Customers";
    if (pathname.startsWith("/csv-import")) return "CSV Import";
    if (pathname.startsWith("/settings")) return "Settings";
    return "Dashboard";
  };

  return (
    <header className={cn(
      "sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b border-slate-100 bg-white/80 px-6 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80 transition-all duration-200"
    )}>
      {/* Mobile Drawer Trigger & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 md:hidden dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900"
        >
          <Menu className="h-5 w-5" />
        </button>
        <span className="text-md font-semibold text-slate-800 md:hidden dark:text-slate-200">
          {getPageTitle()}
        </span>

        {/* Search Bar - Desktop Only */}
        <div className="relative hidden w-72 md:block">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <Input
            type="text"
            placeholder="Search customers or reports..."
            className="pl-9 bg-slate-50/50 border-slate-200 hover:bg-slate-50 focus:bg-white dark:bg-slate-900/40 dark:border-slate-800 dark:hover:bg-slate-900/60 dark:focus:bg-slate-950 text-xs w-full transition-all"
          />
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-4">
        {/* Help Icon */}
        <button className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-slate-900 dark:hover:text-slate-300 transition-colors">
          <HelpCircle className="h-5 w-5" />
        </button>

        {/* Notifications Icon with Indicator */}
        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-slate-900 dark:hover:text-slate-300 transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2.5 right-2.5 h-1.5 w-1.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-950" />
        </button>

        <div className="h-5 w-px bg-slate-200 dark:bg-slate-800" />

        {/* Avatar & Dropdown */}
        <Dropdown
          align="right"
          trigger={
            <div className="flex items-center gap-1 hover:opacity-90 transition-opacity">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop"
                alt="Alex Chen"
                className="h-8 w-8 cursor-pointer rounded-full object-cover border border-slate-200 dark:border-slate-800"
              />
            </div>
          }
        >
          <div className="px-3 py-2 flex flex-col">
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Alex Chen
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              alex.chen@crmsuite.com
            </span>
          </div>
          <DropdownSeparator />
          
          <DropdownItem onClick={() => router.push("/settings")}>
            <Settings className="mr-2 h-4 w-4 text-slate-400" />
            <span>Settings</span>
          </DropdownItem>
          
          <DropdownItem onClick={toggleTheme}>
            {theme === "light" ? (
              <>
                <Moon className="mr-2 h-4 w-4 text-slate-400" />
                <span>Dark Mode</span>
              </>
            ) : (
              <>
                <Sun className="mr-2 h-4 w-4 text-slate-400" />
                <span>Light Mode</span>
              </>
            )}
          </DropdownItem>

          <DropdownSeparator />

          <DropdownItem onClick={() => alert("Logout pressed (placeholder)")} className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20">
            <LogOut className="mr-2 h-4 w-4 text-red-500" />
            <span>Logout</span>
          </DropdownItem>
        </Dropdown>
      </div>
    </header>
  );
}

export { Navbar };
