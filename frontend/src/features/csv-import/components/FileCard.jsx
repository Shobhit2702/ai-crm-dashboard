"use client";

import React from "react";
import { FileText, X, Check } from "lucide-react";
import { ProgressBar } from "./ProgressBar";
import { motion } from "framer-motion";

export function formatBytes(bytes, decimals = 1) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export function FileCard({ fileName, fileSize, rowCount, progress, onRemove, error }) {
  const isComplete = progress === 100 && !error;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="p-5 bg-white border border-slate-100 dark:bg-slate-900 dark:border-slate-800 rounded-2xl shadow-xs space-y-4"
    >
      <div className="flex items-start gap-4">
        {/* File Icon */}
        <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
          <FileText className="h-6 w-6" />
        </div>

        {/* File Details */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200 truncate">
            {fileName}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {formatBytes(fileSize)}
            {rowCount !== undefined && rowCount !== null && ` • ${rowCount} rows`}
          </p>
        </div>

        {/* Remove Button */}
        <button
          onClick={onRemove}
          className="flex-shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 dark:hover:text-slate-300 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="h-4.5 w-4.5" />
        </button>
      </div>

      {/* Progress Bar & Status */}
      <div className="space-y-1.5">
        <ProgressBar
          value={progress}
          color={error ? "bg-red-500" : isComplete ? "bg-emerald-500" : "bg-indigo-600"}
        />
        <div className="flex items-center justify-between text-[11px] font-medium">
          <span
            className={
              error
                ? "text-red-500"
                : isComplete
                ? "text-emerald-500 flex items-center gap-1"
                : "text-indigo-600 dark:text-indigo-400 animate-pulse"
            }
          >
            {error ? (
              error
            ) : isComplete ? (
              <>
                <Check className="h-3 w-3" />
                <span>Ready to Import</span>
              </>
            ) : (
              "Parsing Data..."
            )}
          </span>
          <span className="text-slate-500 dark:text-slate-400">{progress}%</span>
        </div>
      </div>
    </motion.div>
  );
}
