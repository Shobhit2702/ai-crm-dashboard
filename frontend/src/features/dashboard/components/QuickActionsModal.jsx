"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Upload, CheckCircle2, UserPlus, FileSpreadsheet } from "lucide-react";
import { cn } from "@/lib/utils";

// Form validation schema for Add Customer
const addCustomerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  company: z.string().min(2, "Company must be at least 2 characters"),
  status: z.enum(["Active", "Pending"]),
});

export function AddCustomerModal({ open, onOpenChange, onAdd }) {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addCustomerSchema),
    defaultValues: {
      name: "",
      company: "",
      status: "Active",
    },
  });

  const onSubmit = (data) => {
    setSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
      onAdd({
        name: data.name,
        company: data.company,
        status: data.status,
      });
      setTimeout(() => {
        setSuccess(false);
        reset();
        onOpenChange(false);
      }, 1500);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span>Add New Customer</span>
          </DialogTitle>
          <DialogDescription>
            Enter details to add a new lead into your CRM.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <CheckCircle2 className="h-12 w-12 text-emerald-500 mb-2 animate-bounce" />
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              Customer Added Successfully!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-650 dark:text-slate-300">
                Customer Name
              </label>
              <Input
                placeholder="e.g. John Doe"
                {...register("name")}
                className={errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {errors.name && (
                <span className="text-[11px] text-red-500 font-medium">
                  {errors.name.message}
                </span>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-650 dark:text-slate-300">
                Company Name
              </label>
              <Input
                placeholder="e.g. Acme Corp"
                {...register("company")}
                className={errors.company ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {errors.company && (
                <span className="text-[11px] text-red-500 font-medium">
                  {errors.company.message}
                </span>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-650 dark:text-slate-300 block">
                Status
              </label>
              <select
                {...register("status")}
                className="w-full text-sm bg-transparent border border-slate-200 rounded-md px-3 py-2 text-slate-700 focus:outline-hidden dark:border-slate-800 dark:text-slate-350"
              >
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
              </select>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting} className="bg-blue-600 text-white hover:bg-blue-700">
                {submitting ? (
                  <>
                    <Spinner size="xs" className="mr-1.5" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Add Customer</span>
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function ImportCSVModal({ open, onOpenChange, onImport }) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.endsWith(".csv")) {
        setFile(droppedFile);
      } else {
        alert("Only CSV files are supported!");
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.name.endsWith(".csv")) {
        setFile(selectedFile);
      } else {
        alert("Only CSV files are supported!");
      }
    }
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    // Simulate parser
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      onImport({
        filename: file.name,
        records: "1.2k records", // mock record count
        time: "Just now",
        status: "success",
      });
      setTimeout(() => {
        setSuccess(false);
        setFile(null);
        onOpenChange(false);
      }, 1500);
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <span>Import CSV Database</span>
          </DialogTitle>
          <DialogDescription>
            Upload a CSV sheet to batch load customer profiles.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <CheckCircle2 className="h-12 w-12 text-emerald-500 mb-2 animate-bounce" />
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              CSV Parsed and Imported Successfully!
            </p>
          </div>
        ) : (
          <form onSubmit={handleUploadSubmit} className="space-y-4">
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={cn(
                "relative flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 p-8 text-center bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer dark:border-slate-800 dark:bg-slate-900/10 dark:hover:bg-slate-900/20",
                dragActive ? "border-indigo-500 bg-indigo-50/30 dark:border-indigo-400" : ""
              )}
            >
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={loading}
              />

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 mb-3">
                <Upload className="h-6 w-6" />
              </div>
              
              {file ? (
                <div className="flex flex-col items-center gap-1">
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate max-w-xs">
                    {file.name}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {(file.size / 1024).toFixed(1)} KB
                  </span>
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Drag and drop your CSV here, or click to browse
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Maximum upload file size 10MB
                  </span>
                </div>
              )}
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setFile(null);
                  onOpenChange(false);
                }}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!file || loading}
                className="bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Spinner size="xs" className="mr-1.5" />
                    <span>Processing CSV...</span>
                  </>
                ) : (
                  <span>Upload and Parse</span>
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
