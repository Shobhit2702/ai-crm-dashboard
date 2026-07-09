"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { CustomerAvatar } from "./CustomerAvatar";
import { StatusBadge } from "./StatusBadge";
import { Dropdown, DropdownItem } from "@/components/ui/dropdown";
import { MoreHorizontal, Eye, Trash, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function CustomerTable({
  data,
  selectedRowIds,
  onRowSelectionChange,
  onDeleteCustomer,
  pagination,
  onPageChange,
}) {
  const router = useRouter();

  // Define columns for TanStack Table
  const columns = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllPageRowsSelected()}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
            className="h-4.5 w-4.5 rounded border-slate-350 text-blue-600 focus:ring-blue-500 cursor-pointer dark:border-slate-800"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            onChange={row.getToggleSelectedHandler()}
            className="h-4.5 w-4.5 rounded border-slate-350 text-blue-600 focus:ring-blue-500 cursor-pointer dark:border-slate-800"
          />
        ),
      },
      {
        accessorKey: "customer",
        header: "CUSTOMER",
        cell: ({ row }) => {
          const name = row.original.name;
          const email = row.original.email;
          const avatar = row.original.avatar;
          return (
            <div className="flex items-center gap-3">
              <CustomerAvatar avatar={avatar} name={name} size="sm" />
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {name}
                </span>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 truncate max-w-[180px]">
                  {email}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "company",
        header: "COMPANY",
        cell: ({ row }) => (
          <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
            {row.original.company}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "STATUS",
        cell: ({ row }) => (
          <StatusBadge status={row.original.status} className="px-2.5 py-0.5 text-[10px] font-bold" />
        ),
      },
      {
        accessorKey: "createdDate",
        header: "DATE CREATED",
        cell: ({ row }) => (
          <span className="text-xs text-slate-500 dark:text-slate-450 font-medium">
            {row.original.createdDate}
          </span>
        ),
      },
      {
        id: "actions",
        header: "ACTIONS",
        cell: ({ row }) => {
          const customerId = row.original.id;
          return (
            <Dropdown
              align="right"
              trigger={
                <button className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-900 dark:hover:text-slate-300 transition-colors">
                  <MoreHorizontal className="h-4.5 w-4.5" />
                </button>
              }
            >
              <DropdownItem onClick={() => router.push(`/customers/${customerId}`)}>
                <Eye className="mr-2 h-4 w-4 text-slate-400" />
                <span>View Profile</span>
              </DropdownItem>
              <DropdownItem
                onClick={() => onDeleteCustomer(customerId)}
                className="text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20"
              >
                <Trash className="mr-2 h-4 w-4 text-red-500" />
                <span>Delete</span>
              </DropdownItem>
            </Dropdown>
          );
        },
      },
    ],
    [router, onDeleteCustomer]
  );

  // TanStack Table Instance
  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection: selectedRowIds,
    },
    onRowSelectionChange,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-100 dark:bg-slate-950 dark:border-slate-850 shadow-xs overflow-hidden transition-all duration-200">
      <div className="w-full overflow-x-auto">
        <Table className="min-w-[800px]">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent bg-slate-50/20 dark:bg-slate-900/10">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="py-3.5 px-4 font-semibold text-[11px] tracking-wider text-slate-400 dark:text-slate-500 uppercase border-b border-slate-100 dark:border-slate-850">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-b border-slate-100/70 hover:bg-slate-50/30 dark:border-slate-850/60 dark:hover:bg-slate-900/20"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-4 px-4 align-middle">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-slate-500 dark:text-slate-400"
                >
                  No customer records found matching your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
      {pagination && (
        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-850 px-6 py-4">
          <span className="text-xs text-slate-500 dark:text-slate-450">
            Showing <span className="font-semibold">{pagination.startIndex}-{pagination.endIndex}</span> of{" "}
            <span className="font-semibold">{pagination.totalCount}</span> customers
          </span>

          <div className="flex items-center gap-1">
            {/* Prev button */}
            <Button
              variant="outline"
              size="icon"
              disabled={pagination.currentPage === 1}
              onClick={() => onPageChange(pagination.currentPage - 1)}
              className="h-8 w-8 text-slate-500 border-slate-200 hover:bg-slate-50 dark:border-slate-850 dark:hover:bg-slate-900"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Pagination buttons */}
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={pagination.currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(page)}
                className={cn(
                  "h-8 px-3 text-xs font-semibold rounded-md",
                  pagination.currentPage === page
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "text-slate-650 border-slate-200 hover:bg-slate-50 dark:border-slate-850 dark:hover:bg-slate-900"
                )}
              >
                {page}
              </Button>
            ))}

            {/* Next button */}
            <Button
              variant="outline"
              size="icon"
              disabled={pagination.currentPage === pagination.totalPages}
              onClick={() => onPageChange(pagination.currentPage + 1)}
              className="h-8 w-8 text-slate-500 border-slate-200 hover:bg-slate-50 dark:border-slate-850 dark:hover:bg-slate-900"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export { CustomerTable };
