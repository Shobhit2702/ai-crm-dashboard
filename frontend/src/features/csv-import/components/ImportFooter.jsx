"use client";

import React from "react";
import { cn } from "@/lib/utils";

export function ImportFooter({ onCancel, onImport, validCount, isParsing, hasFile, disabled }) {
  return (
    <div className="border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-6 rounded-2xl">
      <button
        onClick={onCancel}
        className="w-full md:w-auto px-5 py-2.5 text-sm font-semibold border border-slate-200 dark:border-slate-850 text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/80 rounded-xl transition-colors cursor-pointer text-center"
      >
        Cancel
      </button>

      <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto justify-end">
        {hasFile && !isParsing && (
          <span className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium text-center">
            {validCount > 0 ? (
              <>
                Ready to process{" "}
                <strong className="font-bold text-slate-800 dark:text-slate-200">
                  {validCount}
                </strong>{" "}
                customer records.
              </>
            ) : (
              "No valid customer records to process."
            )}
          </span>
        )}
        <button
          onClick={onImport}
          disabled={disabled}
          className={cn(
            "w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl transition-all cursor-pointer shadow-xs hover:bg-blue-700",
            disabled && "opacity-40 hover:bg-blue-600 cursor-not-allowed"
          )}
        >
          <span>Import Customers</span>
          <svg
            className="h-4.5 w-4.5 stroke-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </button>
      </div>
    </div>
  );
}
