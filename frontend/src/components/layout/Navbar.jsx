"use client";

import { usePathname } from "next/navigation";
import { Search, Bell, HelpCircle, Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

function Navbar({ collapsed, setMobileOpen }) {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

  // Get active tab name for mobile header or display breadcrumbs
  const getPageTitle = () => {
    if (pathname.startsWith("/customers")) return "Customers";
    if (pathname.startsWith("/csv-import")) return "CSV Import";
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
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-slate-900 dark:hover:text-slate-300 transition-colors"
          aria-label="Toggle theme"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </button>

        {/* Help Icon */}
        <button className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-slate-900 dark:hover:text-slate-300 transition-colors">
          <HelpCircle className="h-5 w-5" />
        </button>

        {/* Notifications Icon with Indicator */}
        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-slate-900 dark:hover:text-slate-300 transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2.5 right-2.5 h-1.5 w-1.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-950" />
        </button>
      </div>
    </header>
  );
}

export { Navbar };
