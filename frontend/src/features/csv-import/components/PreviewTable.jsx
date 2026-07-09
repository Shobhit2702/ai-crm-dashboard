"use client";

import React, { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function PreviewTable({ data = [], isParsing = false, hasFile = false }) {
  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "NAME",
        cell: ({ getValue, row }) => {
          const val = getValue() || "";
          const isNameInvalid = row.original.errors?.name;
          return (
            <div className="flex items-center gap-1.5 font-medium">
              <span
                className={cn(
                  isNameInvalid
                    ? "text-rose-600 font-bold dark:text-rose-450"
                    : "text-slate-800 dark:text-slate-200"
                )}
              >
                {val || <span className="text-slate-400 italic">(Empty)</span>}
              </span>
              {isNameInvalid && <AlertCircle className="h-4 w-4 text-rose-500 shrink-0" />}
            </div>
          );
        },
      },
      {
        accessorKey: "email",
        header: "EMAIL",
        cell: ({ getValue, row }) => {
          const val = getValue() || "";
          const isEmailInvalid = row.original.errors?.email;
          return (
            <div className="flex items-center gap-1.5">
              <span
                className={cn(
                  isEmailInvalid
                    ? "text-rose-600 font-bold dark:text-rose-450"
                    : "text-slate-600 dark:text-slate-350"
                )}
              >
                {val || <span className="text-slate-400 italic">(Empty)</span>}
              </span>
              {isEmailInvalid && <AlertCircle className="h-4 w-4 text-rose-500 shrink-0" />}
            </div>
          );
        },
      },
      {
        accessorKey: "company",
        header: "COMPANY",
        cell: ({ getValue }) => {
          const val = getValue();
          return (
            <span className="text-slate-650 dark:text-slate-400 font-medium">
              {val || "Unknown"}
            </span>
          );
        },
      },
      {
        accessorKey: "location",
        header: "LOCATION",
        cell: ({ getValue }) => {
          const val = getValue();
          return (
            <span className="text-slate-650 dark:text-slate-400 font-medium">
              {val || "Remote"}
            </span>
          );
        },
      },
    ],
    []
  );

  // Take the first 5 rows for display
  const previewData = useMemo(() => data.slice(0, 5), [data]);

  const table = useReactTable({
    data: previewData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="bg-white border border-slate-100 dark:bg-slate-950 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden transition-all duration-200">
      {/* Header Panel */}
      <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-900/10">
        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">
          Data Preview
        </h3>
        <span className="text-[10px] tracking-wider uppercase font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full dark:text-blue-400 dark:bg-blue-950/40">
          Top 5 Rows
        </span>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <div className="max-h-[350px] overflow-y-auto relative">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/60 dark:bg-slate-900/40 sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-slate-100 dark:border-slate-800">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500"
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {isParsing ? (
                // Parsing Skeleton
                Array.from({ length: 3 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    {Array.from({ length: 4 }).map((_, cIdx) => (
                      <td key={cIdx} className="px-6 py-4.5">
                        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-md w-3/4" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : !hasFile || previewData.length === 0 ? (
                // Empty state
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400 dark:text-slate-500">
                    <p className="text-sm font-medium">No data uploaded yet</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Upload a CSV file to preview records
                    </p>
                  </td>
                </tr>
              ) : (
                // Render parsed rows
                table.getRowModel().rows.map((row) => {
                  const isRowInvalid = !row.original.isValid;
                  return (
                    <tr
                      key={row.id}
                      className={cn(
                        "transition-colors hover:bg-slate-50/40 dark:hover:bg-slate-900/10",
                        isRowInvalid && "bg-rose-500/[0.02] dark:bg-rose-500/[0.01]"
                      )}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-6 py-4 text-sm">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
