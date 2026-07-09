"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function ProgressBar({ value, className, color = "bg-indigo-600" }) {
  // Clamp value between 0 and 100
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className={cn("w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden", className)}>
      <motion.div
        className={cn("h-full rounded-full", color)}
        initial={{ width: 0 }}
        animate={{ width: `${clampedValue}%` }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      />
    </div>
  );
}
