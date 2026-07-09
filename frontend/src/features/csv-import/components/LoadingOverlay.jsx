"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Spinner } from "@/components/ui/spinner";

export function LoadingOverlay({ open, message = "Processing..." }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/60 backdrop-blur-xs"
        >
          <motion.div
            initial={{ scale: 0.9, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 10 }}
            className="flex flex-col items-center gap-4 bg-white dark:bg-slate-900 p-8 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 max-w-sm w-full mx-4 text-center"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
              <Spinner size="lg" className="text-blue-600 dark:text-blue-400" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-semibold text-slate-850 dark:text-slate-100 text-lg">
                Importing Customers
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {message}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
