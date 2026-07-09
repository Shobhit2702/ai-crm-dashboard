"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, XCircle, ArrowRight, RefreshCw, Users, Database } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import Papa from "papaparse";
import { cn } from "@/lib/utils";

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
  const [importResult, setImportResult] = useState(null);
  const [importMessage, setImportMessage] = useState("");
  const [importErrorMessage, setImportErrorMessage] = useState("");

  const progressIntervalRef = useRef(null);
  const importIntervalRef = useRef(null);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      if (importIntervalRef.current) clearInterval(importIntervalRef.current);
    };
  }, []);

  // Handle file select
  const handleFileSelect = async (selectedFile) => {
    // Reset previous states
    handleCancel();

    setFile(selectedFile);
    setIsParsing(true);
    setParseProgress(10);

    // Simulate progress while the API parses
    progressIntervalRef.current = setInterval(() => {
      setParseProgress((prev) => {
        if (prev >= 90) return 90; // Hold at 90% until server responds
        return prev + 10;
      });
    }, 120);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("http://localhost:5001/api/upload", {
        method: "POST",
        body: formData,
      });

      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }

      if (!response.ok) {
        let errorMessage = "File upload failed";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (_) {
          // Fallback if error is not JSON
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();

      setParseProgress(100);

      // Add a slight delay for smooth animation transitions
      setTimeout(() => {
        setIsParsing(false);
        setValidatedData(result.preview);
        setValidRows(result.preview.filter((r) => r.isValid));
        setInvalidRows(result.preview.filter((r) => !r.isValid));
        setSummary({
          total: result.totalRows,
          valid: result.validRows,
          invalid: result.invalidRows,
        });

        toast.success(
          `CSV parsed successfully! Found ${result.validRows} valid records.`
        );
      }, 300);

    } catch (error) {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      setIsParsing(false);
      setParseProgress(0);
      setFile(null);
      toast.error(`Failed to parse CSV: ${error.message}`);
    }
  };

  // Handle remove selected file
  const handleRemoveFile = () => {
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    if (importIntervalRef.current) clearInterval(importIntervalRef.current);
    setFile(null);
    setIsParsing(false);
    setParseProgress(0);
    setRawRows([]);
    setValidatedData([]);
    setValidRows([]);
    setInvalidRows([]);
    setSummary({ total: 0, valid: 0, invalid: 0 });
    setImportStatus("idle");
    setImportResult(null);
    setImportMessage("");
    setImportErrorMessage("");
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

  // Trigger the actual backend import process using the job API
  const handleImport = async () => {
    if (validRows.length === 0) {
      toast.error("No valid customer records to import.");
      return;
    }

    setIsImporting(true);
    setImportStatus("importing");
    setImportMessage("Initializing AI mapper connection...");
    setImportErrorMessage("");

    try {
      const response = await fetch("http://localhost:5001/api/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          records: validRows.map((r) => r.raw || {
            name: r.name,
            email: r.email,
            company: r.company,
            location: r.location
          }),
          runSync: false,
        }),
      });

      if (!response.ok) {
        let errorMessage = "Import failed to start";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (_) {}
        throw new Error(errorMessage);
      }

      const initResult = await response.json();
      const jobId = initResult.data.jobId;

      if (!jobId) {
        throw new Error("No job ID returned from server.");
      }

      setImportMessage("AI mapping in progress...");

      // Start polling the job status endpoint
      importIntervalRef.current = setInterval(async () => {
        try {
          const statusRes = await fetch(`http://localhost:5001/api/import/status/${jobId}`);
          if (!statusRes.ok) {
            throw new Error("Failed to retrieve import job status.");
          }

          const statusData = await statusRes.json();
          const { status, progress, totalRecords, processedRecords, result, error } = statusData.data;

          if (status === "completed") {
            if (importIntervalRef.current) clearInterval(importIntervalRef.current);
            setIsImporting(false);
            setImportResult(result);
            setImportStatus("success");
            toast.success(`Successfully imported ${result.imported} CRM records!`);
          } else if (status === "failed") {
            if (importIntervalRef.current) clearInterval(importIntervalRef.current);
            setIsImporting(false);
            setImportStatus("failed");
            setImportErrorMessage(error || "An error occurred during AI mapping.");
            toast.error(error || "AI mapping failed.");
          } else {
            // processing/pending
            setImportMessage(
              `AI processing: ${progress}% complete (${processedRecords}/${totalRecords} records mapped)...`
            );
          }
        } catch (pollErr) {
          if (importIntervalRef.current) clearInterval(importIntervalRef.current);
          setIsImporting(false);
          setImportStatus("failed");
          setImportErrorMessage(pollErr.message || "Failed to retrieve import status.");
          toast.error(pollErr.message || "Failed to retrieve import status.");
        }
      }, 1000);

    } catch (error) {
      setIsImporting(false);
      setImportStatus("failed");
      setImportErrorMessage(error.message || "Failed to initiate import process.");
      toast.error(error.message || "Failed to initiate import process.");
    }
  };

  // View States Rendering
  if (importStatus === "success") {
    return (
      <div className="space-y-6">
        <SectionHeader breadcrumbs={["Home", "CSV Import"]} title="Import Complete" />

        <div className="max-w-4xl mx-auto py-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-slate-100 dark:bg-slate-900 dark:border-slate-800 rounded-3xl p-8 shadow-lg space-y-6 text-center"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-10 w-10 animate-bounce" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Import Successful!
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                Your customer contacts have been mapped by the AI and synced with your enterprise CRM.
              </p>
            </div>

            {/* Import Meta Cards */}
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto pt-2">
              <div className="p-3.5 bg-emerald-50/40 dark:bg-emerald-950/10 rounded-xl border border-emerald-100/30 dark:border-emerald-900/10">
                <span className="text-xs text-emerald-500 font-semibold block">Imported</span>
                <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-500">{importResult?.imported ?? 0}</span>
              </div>
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100/60 dark:border-slate-800">
                <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold block">Skipped</span>
                <span className="text-lg font-extrabold text-slate-800 dark:text-slate-200">{importResult?.skipped ?? 0}</span>
              </div>
              <div className="p-3.5 bg-rose-50/40 dark:bg-rose-950/10 rounded-xl border border-rose-100/30 dark:border-rose-900/10">
                <span className="text-xs text-rose-500 font-semibold block">Failed</span>
                <span className="text-lg font-extrabold text-rose-650 dark:text-rose-450">{importResult?.failed ?? 0}</span>
              </div>
            </div>

            {/* Final CRM Records Table */}
            {importResult?.records && importResult.records.length > 0 && (
              <div className="mt-8 text-left space-y-3">
                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 px-1">
                  Final CRM Records
                </h3>
                <div className="bg-white border border-slate-100 dark:bg-slate-950 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
                  <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead className="bg-slate-50/60 dark:bg-slate-900/40 sticky top-0 z-10">
                        <tr className="border-b border-slate-100 dark:border-slate-800">
                          <th className="px-4 py-3 font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Name</th>
                          <th className="px-4 py-3 font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Email</th>
                          <th className="px-4 py-3 font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Company</th>
                          <th className="px-4 py-3 font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Source</th>
                          <th className="px-4 py-3 font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Status</th>
                          <th className="px-4 py-3 font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Owner</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                        {importResult.records.map((rec, rIdx) => (
                          <tr key={rIdx} className="hover:bg-slate-50/40 dark:hover:bg-slate-900/10 transition-colors">
                            <td className="px-4 py-3 text-slate-800 dark:text-slate-200 font-medium">{rec.name || <span className="text-slate-400 italic">N/A</span>}</td>
                            <td className="px-4 py-3 text-slate-600 dark:text-slate-350">{rec.email || <span className="text-slate-400 italic">N/A</span>}</td>
                            <td className="px-4 py-3 text-slate-650 dark:text-slate-400">{rec.company || <span className="text-slate-400 italic">N/A</span>}</td>
                            <td className="px-4 py-3 text-slate-650 dark:text-slate-400">
                              {rec.data_source ? (
                                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 font-semibold tracking-wider text-[10px]">
                                  {rec.data_source}
                                </span>
                              ) : (
                                <span className="text-slate-400 italic">N/A</span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              {rec.crm_status ? (
                                <span className={cn(
                                  "px-2 py-0.5 rounded-full font-semibold text-[10px]",
                                  rec.crm_status === "GOOD_LEAD_FOLLOW_UP" && "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-455",
                                  rec.crm_status === "DID_NOT_CONNECT" && "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-455",
                                  rec.crm_status === "BAD_LEAD" && "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-455",
                                  rec.crm_status === "SALE_DONE" && "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-455"
                                )}>
                                  {rec.crm_status}
                                </span>
                              ) : (
                                <span className="text-slate-400 italic">N/A</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-slate-605 dark:text-slate-350">{rec.lead_owner || <span className="text-slate-400 italic">N/A</span>}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

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
                {importErrorMessage || "The database server rejected the transaction batch. This could be due to network timeout or service unavailability."}
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
        message={importMessage || `Syncing ${summary.valid} customer records with the cloud database...`}
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
