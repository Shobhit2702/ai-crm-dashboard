"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dropdown, DropdownItem } from "@/components/ui/dropdown";
import { cn } from "@/lib/utils";

function BulkActionBar({
  selectedCount,
  totalCount,
  onClearSelection,
  onBulkStatusChange,
  onBulkDelete,
}) {
  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl border border-blue-100 bg-blue-50/70 dark:border-blue-900/40 dark:bg-blue-950/20 mb-4 transition-all duration-200"
        >
          {/* Label info */}
          <div className="flex items-center gap-2 text-xs md:text-sm text-blue-700 dark:text-blue-450">
            <span className="font-bold">{selectedCount} customers selected</span>
            <span className="text-blue-300">|</span>
            <button
              onClick={() => alert(`Selected all ${totalCount} records (simulated)`)}
              className="font-medium underline hover:text-blue-800 dark:hover:text-blue-300"
            >
              Select all {totalCount} customers
            </button>
          </div>

          {/* Action triggers */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {/* Edit Status Dropdown */}
            <Dropdown
              align="right"
              trigger={
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 bg-white border-blue-200 text-blue-700 hover:bg-blue-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200"
                >
                  <Edit className="h-3.5 w-3.5" />
                  <span>Edit Status</span>
                </Button>
              }
            >
              <DropdownItem onClick={() => onBulkStatusChange("Active")}>
                <span className="h-2 w-2 rounded-full bg-emerald-500 mr-2" />
                Set to Active
              </DropdownItem>
              <DropdownItem onClick={() => onBulkStatusChange("Lead")}>
                <span className="h-2 w-2 rounded-full bg-amber-500 mr-2" />
                Set to Lead
              </DropdownItem>
              <DropdownItem onClick={() => onBulkStatusChange("Inactive")}>
                <span className="h-2 w-2 rounded-full bg-red-500 mr-2" />
                Set to Inactive
              </DropdownItem>
            </Dropdown>

            {/* Delete button */}
            <Button
              variant="outline"
              size="sm"
              onClick={onBulkDelete}
              className="flex items-center gap-1 bg-white border-red-200 text-red-650 hover:bg-red-50 dark:bg-slate-900 dark:border-slate-850 dark:text-red-400"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete</span>
            </Button>

            <button
              onClick={onClearSelection}
              className="p-1 rounded-md text-blue-500 hover:bg-blue-100/60 dark:text-blue-400 dark:hover:bg-blue-950/40 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export { BulkActionBar };
