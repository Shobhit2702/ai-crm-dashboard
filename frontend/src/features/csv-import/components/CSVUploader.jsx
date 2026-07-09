"use client";

import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

export function CSVUploader({ onFileSelect, disabled }) {
  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      if (disabled) return;

      if (rejectedFiles && rejectedFiles.length > 0) {
        const error = rejectedFiles[0].errors[0];
        if (error.code === "file-too-large") {
          toast.error("File is too large. Maximum size allowed is 50MB.");
        } else if (error.code === "file-invalid-type") {
          toast.error("Invalid file format. Please upload a CSV file.");
        } else {
          toast.error(error.message || "File upload failed.");
        }
        return;
      }

      if (acceptedFiles && acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        
        // Final sanity check for size and empty file
        if (file.size === 0) {
          toast.error("The selected CSV file is empty.");
          return;
        }

        onFileSelect(file);
      }
    },
    [onFileSelect, disabled]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.ms-excel": [".csv"],
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    multiple: false,
    disabled,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-300 cursor-pointer select-none",
        isDragActive
          ? "border-blue-500 bg-blue-50/20 dark:border-blue-400 dark:bg-blue-950/10 scale-[1.01]"
          : "border-slate-200 bg-slate-50/10 hover:bg-slate-50/30 hover:border-slate-350 dark:border-slate-800 dark:bg-slate-900/10 dark:hover:bg-slate-900/20 dark:hover:border-slate-700",
        disabled ? "opacity-50 pointer-events-none" : ""
      )}
    >
      <input {...getInputProps()} />

      <motion.div
        animate={{ y: isDragActive ? -5 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 mb-4 shadow-sm"
      >
        <Upload className="h-6 w-6" />
      </motion.div>

      <div className="flex flex-col gap-1.5 max-w-sm">
        <h3 className="font-semibold text-base text-slate-800 dark:text-slate-200">
          Drop your CSV here
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Or click to browse your local files
        </p>
        <span className="text-xs text-slate-400 dark:text-slate-500 mt-2">
          Maximum file size: 50MB
        </span>
      </div>
    </div>
  );
}
