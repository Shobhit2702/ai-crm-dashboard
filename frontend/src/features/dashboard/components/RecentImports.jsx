import React from "react";
import { FileSpreadsheet, CheckCircle2, AlertCircle, MoreVertical } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function RecentImports({ data }) {
  return (
    <Card className="col-span-1 flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base font-semibold text-slate-800 dark:text-slate-100">
          Recent Imports
        </CardTitle>
        <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
          <MoreVertical className="h-4 w-4" />
        </button>
      </CardHeader>
      
      <CardContent className="flex-1 space-y-3">
        {data && data.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-3.5 rounded-xl border border-slate-50 bg-slate-50/30 hover:bg-slate-50 transition-colors duration-150 dark:border-slate-800/40 dark:bg-slate-900/10 dark:hover:bg-slate-900/30"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              {/* Spreadsheet icon box */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                <FileSpreadsheet className="h-5 w-5" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                  {item.filename}
                </span>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                  {item.records} • {item.time}
                </span>
              </div>
            </div>

            {/* Status indicator */}
            <div className="shrink-0 ml-2">
              {item.status === "success" ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-500 fill-emerald-50 dark:fill-transparent" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500 fill-red-50 dark:fill-transparent" />
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export { RecentImports };
