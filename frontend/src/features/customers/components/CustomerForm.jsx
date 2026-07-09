"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Save, Lightbulb, CheckCircle2, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Form validation schema
const customerSchema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(5, "Phone number is required"),
  status: z.enum(["Active", "Lead", "Inactive"]),
  company: z.string().min(2, "Company name must be at least 2 characters"),
  jobTitle: z.string().min(2, "Job title must be at least 2 characters"),
  notes: z.string().optional(),
});

function CustomerForm({ initialValues, onSave }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'success' | 'error', message: '' }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(customerSchema),
    defaultValues: initialValues || {
      name: "",
      email: "",
      phone: "",
      status: "Lead",
      company: "",
      jobTitle: "",
      notes: "",
    },
  });

  const onSubmit = (data) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setToast({
        type: "success",
        message: "Customer profile saved successfully!",
      });
      if (onSave) {
        onSave(data);
      }
      setTimeout(() => {
        setToast(null);
        router.push("/customers");
      }, 1500);
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Toast Alert Banner */}
      {toast && (
        <div
          className={cn(
            "flex items-center gap-3 p-4 rounded-xl text-xs md:text-sm font-semibold border shadow-xs animate-bounce",
            toast.type === "success"
              ? "bg-emerald-50 border-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:border-emerald-900/40 dark:text-emerald-450"
              : "bg-red-50 border-red-100 text-red-700 dark:bg-red-950/20 dark:border-red-900/40 dark:text-red-450"
          )}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Main Form Box */}
      <Card className="border border-slate-100 dark:bg-slate-950 dark:border-slate-850 shadow-xs">
        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            
            {/* Section 1: Primary Information */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold tracking-wider text-blue-600 dark:text-blue-450 uppercase border-b border-slate-100 dark:border-slate-850 pb-2">
                Primary Information
              </h3>
              
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-650 dark:text-slate-350">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="e.g. Jane Doe"
                    {...register("name")}
                    className={errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}
                  />
                  {errors.name && (
                    <span className="text-[11px] text-red-500 font-medium">
                      {errors.name.message}
                    </span>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-1.5 relative">
                  <label className="text-xs font-semibold text-slate-650 dark:text-slate-350">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="jane.doe@company"
                    {...register("email")}
                    className={errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
                  />
                  {errors.email && (
                    <div className="flex items-center gap-1.5 mt-1.5 text-red-500">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      <span className="text-[11px] font-medium">
                        {errors.email.message}
                      </span>
                    </div>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-650 dark:text-slate-350">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="+1 (555) 000-0000"
                    {...register("phone")}
                    className={errors.phone ? "border-red-500 focus-visible:ring-red-500" : ""}
                  />
                  {errors.phone && (
                    <span className="text-[11px] text-red-500 font-medium">
                      {errors.phone.message}
                    </span>
                  )}
                </div>

                {/* Status Dropdown */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-650 dark:text-slate-350 block">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("status")}
                    className="w-full text-sm bg-transparent border border-slate-200 rounded-md px-3 py-2 text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-blue-500 dark:border-slate-800 dark:text-slate-350 dark:bg-slate-950"
                  >
                    <option value="Active">Active</option>
                    <option value="Lead">Lead</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                  {errors.status && (
                    <span className="text-[11px] text-red-500 font-medium">
                      {errors.status.message}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Section 2: Professional Details */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold tracking-wider text-blue-600 dark:text-blue-450 uppercase border-b border-slate-100 dark:border-slate-850 pb-2">
                Professional Details
              </h3>
              
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                {/* Company */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-650 dark:text-slate-350">
                    Company <span className="text-red-500">*</span>
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

                {/* Job Title */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-650 dark:text-slate-350">
                    Job Title <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="e.g. Product Manager"
                    {...register("jobTitle")}
                    className={errors.jobTitle ? "border-red-500 focus-visible:ring-red-500" : ""}
                  />
                  {errors.jobTitle && (
                    <span className="text-[11px] text-red-500 font-medium">
                      {errors.jobTitle.message}
                    </span>
                  )}
                </div>

                {/* Notes */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-semibold text-slate-650 dark:text-slate-350">
                    Notes
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Enter secondary customer details or notes..."
                    {...register("notes")}
                    className="flex w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-slate-500 focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:placeholder:text-slate-400 dark:focus-visible:ring-blue-500 dark:text-slate-100"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-850">
              <Button
                type="button"
                variant="ghost"
                disabled={loading}
                onClick={() => router.push("/customers")}
                className="text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-900"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-1.5 px-5 shadow-xs"
              >
                <Save className="h-4 w-4" />
                <span>{loading ? "Saving..." : "Save Customer"}</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Pro Tip Card */}
      <div className="flex gap-3.5 p-4 rounded-xl border border-emerald-100 bg-emerald-50/50 dark:border-emerald-950/20 dark:bg-emerald-950/10">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-650 dark:bg-emerald-950/40 dark:text-emerald-450">
          <Lightbulb className="h-4.5 w-4.5" />
        </div>
        <div className="flex flex-col gap-0.5 text-xs font-semibold text-emerald-800 dark:text-emerald-450">
          <span className="font-bold">Pro Tip</span>
          <p className="font-medium text-[11px] text-emerald-700 dark:text-emerald-500 leading-relaxed mt-0.5">
            You can also import customers in bulk using our{" "}
            <span
              onClick={() => router.push("/csv-import")}
              className="underline font-bold cursor-pointer hover:text-emerald-800"
            >
              CSV Import tool
            </span>{" "}
            to save time on data entry.
          </p>
        </div>
      </div>
    </div>
  );
}

export { CustomerForm };
