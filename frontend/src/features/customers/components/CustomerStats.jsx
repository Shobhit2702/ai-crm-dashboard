"use client";

import React from "react";
import { TrendingUp, History, ShieldCheck, ChevronRight, HelpCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// PAGE 1: Bottom Analytics Cards for Customers List
export function CustomerListStats() {
  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-3 mt-8">
      {/* Lead Conversion Card */}
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                Lead Conversion
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                  24%
                </span>
                <span className="flex items-center gap-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="h-3 w-3" />
                  +4.2%
                </span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-[220px] leading-relaxed">
                Average conversion from lead to customer this month.
              </span>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Card */}
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-3 w-full">
              <span className="text-[11px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                Recent Activity
              </span>
              
              <div className="space-y-3 mt-1.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-350">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                  <span>Sarah Jenkins upgraded plan</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-350">
                  <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                  <span>New lead from Lumina Tech</span>
                </div>
              </div>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-650 dark:bg-purple-950/40 dark:text-purple-400">
              <History className="h-5 w-5" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Database Health Card */}
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1 w-full">
              <span className="text-[11px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                Database Health
              </span>
              
              <div className="mt-4 w-full">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-slate-500 dark:text-slate-450">Health score</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">85%</span>
                </div>
                {/* Progress track */}
                <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-850 overflow-hidden">
                  <div className="h-full w-[85%] rounded-full bg-blue-650 dark:bg-blue-500" />
                </div>
                <span className="text-[11px] text-slate-450 dark:text-slate-500 mt-2 block">
                  85% of records are fully enriched.
                </span>
              </div>

              <button
                onClick={() => alert("Simulating Database Health Scan...")}
                className="flex items-center gap-0.5 text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-450 dark:hover:text-blue-350 mt-4 group"
              >
                <span>Run health check</span>
                <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-650 dark:bg-emerald-950/40 dark:text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// PAGE 2: Stats row inside Customer Details Overview Tab
export function CustomerDetailsStats({ ltv, lastInteraction, lastInteractionMethod, health }) {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 mb-6">
      {/* Total LTV Card */}
      <Card className="shadow-xs dark:bg-slate-900/40 dark:border-slate-800">
        <CardContent className="p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Total LTV
          </span>
          <h4 className="text-xl font-bold text-slate-800 dark:text-slate-150 mt-1">
            ${ltv ? ltv.toLocaleString() : "0"}
          </h4>
          <span className="text-[10px] font-semibold text-emerald-600 mt-1.5 block">
            +12% from last month
          </span>
        </CardContent>
      </Card>

      {/* Last Interaction Card */}
      <Card className="shadow-xs dark:bg-slate-900/40 dark:border-slate-800">
        <CardContent className="p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Last Interaction
          </span>
          <h4 className="text-xl font-bold text-slate-800 dark:text-slate-150 mt-1">
            {lastInteraction || "None"}
          </h4>
          <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 mt-1.5 block">
            {lastInteractionMethod || "N/A"}
          </span>
        </CardContent>
      </Card>

      {/* Account Health Card */}
      <Card className="shadow-xs dark:bg-slate-900/40 dark:border-slate-800">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Account Health
            </span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {health || 0}%
            </span>
          </div>
          
          <div className="mt-4">
            <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full",
                  health > 75 ? "bg-emerald-500" : health > 50 ? "bg-amber-500" : "bg-red-500"
                )}
                style={{ width: `${health || 0}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
