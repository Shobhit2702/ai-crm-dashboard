"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, XCircle, ArrowRight, RefreshCw, Users, Database } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import Papa from "papaparse";

import { SectionHeader } from "@/components/common/SectionHeader";
import { CSVUploader } from "./components/CSVUploader";
import { FileCard } from "./components/FileCard";
import { ImportSummary } from "./components/ImportSummary";
import { PreviewTable } from "./components/PreviewTable";
import { ImportFooter } from "./components/ImportFooter";
import { LoadingOverlay } from "./components/LoadingOverlay";
import { validateBatch, downloadErrorReport } from "./utils/validation";

export function CSVImportView() {
  const router = useRouter();

  // Core UI States
  const [file, setFile] = useState(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parseProgress, setParseProgress] = useState(0);
  
  // Data States
  const [rawRows, setRawRows] = useState([]);
  const [validatedData, setValidatedData] = useState([]);
  const [validRows, setValidRows] = useState([]);
  const [invalidRows, setInvalidRows] = useState([]);
  const [summary, setSummary] = useState({ total: 0, valid: 0, invalid: 0 });

  // Import Simulation States
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState("idle"); // 'idle' | 'importing' | 'success' | 'failed'

  const progressIntervalRef = useRef(null);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, []);

  // Handle file select
  const handleFileSelect = (selectedFile) => {
    // Reset previous states
    handleCancel();

    setFile(selectedFile);
    setIsParsing(true);
    setParseProgress(0);

    // Parse CSV locally using Papa Parse
    Papa.parse(selectedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsed = results.data;
        setRawRows(parsed);

        // Run validation
        const validationResult = validateBatch(parsed);

        // Simulate a smooth, visual parsing progress bar to wow the user
        let currentProgress = 0;
        progressIntervalRef.current = setInterval(() => {
          currentProgress += Math.floor(Math.random() * 15) + 10;
          if (currentProgress >= 100) {
            currentProgress = 100;
            clearInterval(progressIntervalRef.current);
            
            // Set final parsed states
            setIsParsing(false);
            setParseProgress(100);
            setValidatedData(validationResult.validatedRows);
            setValidRows(validationResult.validRows);
            setInvalidRows(validationResult.invalidRows);
            setSummary({
              total: validationResult.totalCount,
              valid: validationResult.validCount,
              invalid: validationResult.invalidCount,
            });

            toast.success(
              `CSV parsed successfully! Found ${validationResult.validCount} valid records.`
            );
          } else {
            setParseProgress(currentProgress);
          }
        }, 150);
      },
      error: (error) => {
        setIsParsing(false);
        setParseProgress(0);
        setFile(null);
        toast.error(`Failed to parse CSV: ${error.message}`);
      },
    });
  };

  // Handle remove selected file
  const handleRemoveFile = () => {
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    setFile(null);
    setIsParsing(false);
    setParseProgress(0);
    setRawRows([]);
    setValidatedData([]);
    setValidRows([]);
    setInvalidRows([]);
    setSummary({ total: 0, valid: 0, invalid: 0 });
    setImportStatus("idle");
  };

  // Handle cancel & reset screen
  const handleCancel = () => {
    handleRemoveFile();
    setImportStatus("idle");
  };

  // Trigger download of only invalid rows with errors
  const handleDownloadReport = () => {
    if (invalidRows.length === 0) return;
    downloadErrorReport(invalidRows, file ? file.name : "customers");
    toast.success("Error report downloaded.");
  };

  // Simulate mock database import workflow
  const handleImport = () => {
    if (validRows.length === 0) {
      toast.error("No valid customer records to import.");
      return;
    }

    setIsImporting(true);
    setImportStatus("importing");

    // Simulate database network lag
    setTimeout(() => {
      setIsImporting(false);
      
      // Let's mock a 90% success rate, 10% fail rate for simulation depth
      const isLucky = Math.random() > 0.1;
      
      if (isLucky) {
        setImportStatus("success");
        toast.success(`Successfully imported ${validRows.length} customers!`);
      } else {
        setImportStatus("failed");
        toast.error("Database transaction timed out. Connection refused.");
      }
    }, 2500);
  };

  // View States Rendering
  if (importStatus === "success") {
    return (
      <div className="space-y-6">
        <SectionHeader breadcrumbs={["Home", "CSV Import"]} title="Import Complete" />

        <div className="max-w-2xl mx-auto py-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-slate-100 dark:bg-slate-900 dark:border-slate-800 rounded-3xl p-8 text-center shadow-lg space-y-6"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-10 w-10 animate-bounce" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Import Successful!
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                Your customer contacts have been processed and synced with your enterprise CRM.
              </p>
            </div>

            {/* Import Meta Cards */}
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto pt-2">
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100/60 dark:border-slate-800">
                <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold block">Total</span>
                <span className="text-lg font-extrabold text-slate-800 dark:text-slate-200">{summary.total}</span>
              </div>
              <div className="p-3.5 bg-emerald-50/40 dark:bg-emerald-950/10 rounded-xl border border-emerald-100/30 dark:border-emerald-900/10">
                <span className="text-xs text-emerald-500 font-semibold block">Synced</span>
                <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-500">{summary.valid}</span>
              </div>
              <div className="p-3.5 bg-rose-50/40 dark:bg-rose-950/10 rounded-xl border border-rose-100/30 dark:border-rose-900/10">
                <span className="text-xs text-rose-500 font-semibold block">Ignored</span>
                <span className="text-lg font-extrabold text-rose-600 dark:text-rose-500">{summary.invalid}</span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleCancel}
                className="w-full sm:w-auto px-6 py-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700/80 border border-slate-150 dark:border-slate-700 text-slate-650 dark:text-slate-200 font-semibold rounded-xl text-sm transition-colors cursor-pointer"
              >
                Import Another File
              </button>
              <button
                onClick={() => router.push("/customers")}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all shadow-xs cursor-pointer"
              >
                <Users className="h-4.5 w-4.5" />
                <span>Go to Customers</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (importStatus === "failed") {
    return (
      <div className="space-y-6">
        <SectionHeader breadcrumbs={["Home", "CSV Import"]} title="Import Failed" />

        <div className="max-w-2xl mx-auto py-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-slate-100 dark:bg-slate-900 dark:border-slate-800 rounded-3xl p-8 text-center shadow-lg space-y-6"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-450">
              <XCircle className="h-10 w-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Data Import Failed
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                The database server rejected the transaction batch. This could be due to network timeout or service unavailability.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleCancel}
                className="w-full sm:w-auto px-6 py-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700/80 border border-slate-150 dark:border-slate-700 text-slate-650 dark:text-slate-200 font-semibold rounded-xl text-sm transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all shadow-xs cursor-pointer"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Retry Import</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const hasFile = file !== null;
  const isImportButtonDisabled = !hasFile || isParsing || summary.valid === 0 || isImporting;

  return (
    <div className="space-y-6 relative">
      {/* Simulation Loading Overlay */}
      <LoadingOverlay
        open={isImporting}
        message={`Syncing ${summary.valid} customer records with the cloud database...`}
      />

      {/* Page Title & Context */}
      <SectionHeader
        breadcrumbs={["Home", "CSV Import"]}
        title="Import Customers"
        subtitle="Upload your customer database to sync records with your enterprise dashboard. Supported format: CSV."
      />

      {/* Main Responsive Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Side: Upload Zone & Preview Table */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upload Area */}
          {!hasFile ? (
            <CSVUploader onFileSelect={handleFileSelect} disabled={isParsing} />
          ) : (
            <FileCard
              fileName={file.name}
              fileSize={file.size}
              rowCount={isParsing ? null : summary.total}
              progress={parseProgress}
              onRemove={handleRemoveFile}
            />
          )}

          {/* Preview Table */}
          <PreviewTable
            data={validatedData}
            isParsing={isParsing}
            hasFile={hasFile}
          />
        </div>

        {/* Right Side: Summary Module */}
        <div className="lg:col-span-1">
          <ImportSummary
            totalCount={summary.total}
            validCount={summary.valid}
            invalidCount={summary.invalid}
            onDownloadReport={handleDownloadReport}
            isParsing={isParsing}
            hasFile={hasFile}
          />
        </div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <ImportFooter
        onCancel={handleCancel}
        onImport={handleImport}
        validCount={summary.valid}
        isParsing={isParsing}
        hasFile={hasFile}
        disabled={isImportButtonDisabled}
      />
    </div>
  );
}
