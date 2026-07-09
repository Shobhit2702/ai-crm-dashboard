"use client";

import React from "react";
import { Search, SlidersHorizontal, ArrowUpDown, Download, Plus, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dropdown, DropdownItem } from "@/components/ui/dropdown";
import { useRouter } from "next/navigation";

function CustomerFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortConfig,
  onSortChange,
  onExport,
}) {
  const router = useRouter();

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
        <Input
          type="text"
          placeholder="Global search..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 bg-white border-slate-200 dark:bg-slate-950 dark:border-slate-800 focus-visible:ring-blue-500"
        />
      </div>

      {/* Filter and Action Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Status Filter Dropdown */}
        <Dropdown
          align="left"
          trigger={
            <Button variant="outline" className="flex items-center gap-1.5 border-slate-200 bg-white text-slate-650 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-250">
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filters: {statusFilter || "All"}</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </Button>
          }
        >
          <DropdownItem onClick={() => onStatusFilterChange("")}>All Statuses</DropdownItem>
          <DropdownItem onClick={() => onStatusFilterChange("Active")}>Active Only</DropdownItem>
          <DropdownItem onClick={() => onStatusFilterChange("Lead")}>Leads Only</DropdownItem>
          <DropdownItem onClick={() => onStatusFilterChange("Inactive")}>Inactive Only</DropdownItem>
        </Dropdown>

        {/* Sorting Dropdown */}
        <Dropdown
          align="left"
          trigger={
            <Button variant="outline" className="flex items-center gap-1.5 border-slate-200 bg-white text-slate-650 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-250">
              <ArrowUpDown className="h-4 w-4" />
              <span>Sort: {sortConfig.label || "Default"}</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </Button>
          }
        >
          <DropdownItem onClick={() => onSortChange({ key: "name", direction: "asc", label: "Name (A-Z)" })}>
            Name (A-Z)
          </DropdownItem>
          <DropdownItem onClick={() => onSortChange({ key: "name", direction: "desc", label: "Name (Z-A)" })}>
            Name (Z-A)
          </DropdownItem>
          <DropdownItem onClick={() => onSortChange({ key: "createdDate", direction: "desc", label: "Newest Created" })}>
            Newest Created
          </DropdownItem>
          <DropdownItem onClick={() => onSortChange({ key: "createdDate", direction: "asc", label: "Oldest Created" })}>
            Oldest Created
          </DropdownItem>
        </Dropdown>

        {/* Export Button */}
        <Button
          variant="outline"
          onClick={onExport}
          className="flex items-center gap-1.5 border-slate-200 bg-white text-slate-650 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-250"
        >
          <Download className="h-4 w-4" />
          <span>Export</span>
        </Button>

        {/* Add Customer Button */}
        <Button
          onClick={() => router.push("/customers/new")}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs"
        >
          <Plus className="h-4 w-4" />
          <span>Add Customer</span>
        </Button>
      </div>
    </div>
  );
}

export { CustomerFilters };
