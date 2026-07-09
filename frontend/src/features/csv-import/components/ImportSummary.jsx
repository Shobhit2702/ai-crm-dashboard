"use client";

import React from "react";
import { BarChart3, CheckCircle2, AlertTriangle, Download, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

export function ImportSummary({
  totalCount = 0,
  validCount = 0,
  invalidCount = 0,
  onDownloadReport,
  isParsing = false,
  hasFile = false,
}) {
  const showReportButton = hasFile && !isParsing && invalidCount > 0;

  return (
    <div className="bg-slate-50/50 dark:bg-slate-900/20 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 space-y-6">
      <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">
        Import Summary
      </h3>

      <div className="space-y-4">
        {/* Total Records */}
        <div
          className={cn(
            "flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl border-l-4 border-l-slate-400 transition-all",
            !hasFile && "opacity-60"
          )}
        >
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
              <BarChart3 className="h-4.5 w-4.5" />
            </div>
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              Total Records
            </span>
          </div>
          <span className="text-xl font-bold text-slate-800 dark:text-slate-100">
            {isParsing ? "..." : totalCount}
          </span>
        </div>

        {/* Valid Records */}
        <div
          className={cn(
            "flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl border-l-4 border-l-emerald-500 transition-all",
            !hasFile && "opacity-60"
          )}
        >
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center text-emerald-500">
              <CheckCircle2 className="h-4.5 w-4.5" />
            </div>
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              Valid
            </span>
          </div>
          <span className="text-xl font-bold text-emerald-600 dark:text-emerald-500">
            {isParsing ? "..." : validCount}
          </span>
        </div>

        {/* Invalid Records */}
        <div
          className={cn(
            "flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl border-l-4 border-l-rose-500 transition-all",
            !hasFile && "opacity-60"
          )}
        >
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-rose-50 dark:bg-rose-950/20 flex items-center justify-center text-rose-500">
              <AlertTriangle className="h-4.5 w-4.5" />
            </div>
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              Invalid
            </span>
          </div>
          <span className="text-xl font-bold text-rose-600 dark:text-rose-500">
            {isParsing ? "..." : invalidCount}
          </span>
        </div>
      </div>

      {/* Error Report Downloader */}
      <div className="pt-2">
        <button
          onClick={onDownloadReport}
          disabled={!showReportButton}
          className={cn(
            "flex items-center gap-2 text-sm font-semibold transition-colors w-full justify-between px-1",
            showReportButton
              ? "text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer"
              : "text-slate-450 dark:text-slate-600 cursor-not-allowed opacity-50"
          )}
        >
          <span>Download Error Report</span>
          <Download className="h-4 w-4" />
        </button>
      </div>

      {/* Warning Box */}
      <div className="p-4 bg-amber-50/50 dark:bg-amber-950/10 border border-amber-100/60 dark:border-amber-900/20 rounded-xl flex gap-3 text-amber-850 dark:text-amber-300 transition-all">
        <Lightbulb className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
        <p className="text-[12px] leading-relaxed">
          The system will automatically ignore invalid rows during the primary import. You can fix
          them later in the dashboard.
        </p>
      </div>
    </div>
  );
}
