"use client";

import React, { useState, useMemo } from "react";
import { SectionHeader } from "@/components/common/SectionHeader";
import { CustomerFilters } from "@/features/customers/components/CustomerFilters";
import { CustomerTable } from "@/features/customers/components/CustomerTable";
import { BulkActionBar } from "@/features/customers/components/BulkActionBar";
import { CustomerListStats } from "@/features/customers/components/CustomerStats";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import initialCustomers from "@/features/customers/data/mockCustomers.json";

export default function CustomersPage() {
  const [customers, setCustomers] = useState(initialCustomers);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "createdDate", direction: "desc", label: "Newest Created" });
  
  // Row selection state (dictionary of index/id to boolean)
  const [rowSelection, setRowSelection] = useState({});
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);

  // 1. Filter customers
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.jobTitle && c.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = statusFilter ? c.status === statusFilter : true;

      return matchesSearch && matchesStatus;
    });
  }, [customers, searchQuery, statusFilter]);

  // 2. Sort customers
  const sortedCustomers = useMemo(() => {
    const sorted = [...filteredCustomers];
    if (sortConfig.key) {
      sorted.sort((a, b) => {
        let valA = a[sortConfig.key] || "";
        let valB = b[sortConfig.key] || "";

        // Parse date strings for sorting
        if (sortConfig.key === "createdDate") {
          valA = new Date(valA);
          valB = new Date(valB);
        }

        if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
        if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sorted;
  }, [filteredCustomers, sortConfig]);

  // 3. Paginate customers
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const paginatedCustomers = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return sortedCustomers.slice(startIdx, startIdx + itemsPerPage);
  }, [sortedCustomers, currentPage]);

  const paginationInfo = useMemo(() => {
    const totalCount = sortedCustomers.length;
    const totalPages = Math.ceil(totalCount / itemsPerPage) || 1;
    const startIndex = totalCount === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(currentPage * itemsPerPage, totalCount);

    return {
      currentPage,
      totalPages,
      totalCount,
      startIndex,
      endIndex,
    };
  }, [sortedCustomers, currentPage]);

  // Handle single row deletion
  const handleDeleteConfirm = () => {
    if (!deleteConfirmId) return;
    setCustomers(customers.filter((c) => c.id !== deleteConfirmId));
    setDeleteConfirmId(null);
    setRowSelection({}); // reset selection
  };

  // Selection list extraction
  const selectedRowsList = useMemo(() => {
    // rowSelection is formatted as: { "0": true, "2": true } representing row indices in current page
    return Object.keys(rowSelection).filter((key) => rowSelection[key]);
  }, [rowSelection]);

  const selectedCount = selectedRowsList.length;

  const handleClearSelection = () => {
    setRowSelection({});
  };

  // Bulk Status Update
  const handleBulkStatusChange = (newStatus) => {
    // Get list of IDs selected
    const selectedIds = selectedRowsList.map((idx) => paginatedCustomers[parseInt(idx)].id);
    
    setCustomers(
      customers.map((c) => {
        if (selectedIds.includes(c.id)) {
          return { ...c, status: newStatus };
        }
        return c;
      })
    );
    setRowSelection({}); // Clear selection after action
  };

  // Bulk Delete Update
  const handleBulkDelete = () => {
    const selectedIds = selectedRowsList.map((idx) => paginatedCustomers[parseInt(idx)].id);
    setCustomers(customers.filter((c) => !selectedIds.includes(c.id)));
    setRowSelection({});
    setBulkDeleteConfirm(false);
  };

  // Export mock
  const handleExport = () => {
    alert("Exporting customers data sheet (simulated CSV download)...");
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <SectionHeader
        breadcrumbs={["Home", "Customers"]}
        title="Customers"
        subtitle="Manage and organize your client database and leads."
      />

      {/* Filter and Actions Bar */}
      <CustomerFilters
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setCurrentPage(1);
        }}
        statusFilter={statusFilter}
        onStatusFilterChange={(f) => {
          setStatusFilter(f);
          setCurrentPage(1);
        }}
        sortConfig={sortConfig}
        onSortChange={setSortConfig}
        onExport={handleExport}
      />

      {/* Bulk Operations Panel */}
      <BulkActionBar
        selectedCount={selectedCount}
        totalCount={customers.length}
        onClearSelection={handleClearSelection}
        onBulkStatusChange={handleBulkStatusChange}
        onBulkDelete={() => setBulkDeleteConfirm(true)}
      />

      {/* Data Table */}
      <CustomerTable
        data={paginatedCustomers}
        selectedRowIds={rowSelection}
        onRowSelectionChange={setRowSelection}
        onDeleteCustomer={(id) => setDeleteConfirmId(id)}
        pagination={paginationInfo}
        onPageChange={setCurrentPage}
      />

      {/* Bottom Analytics Rows */}
      <CustomerListStats />

      {/* Single Customer Deletion Modal */}
      <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this customer profile? This action is permanent.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} className="bg-red-650 hover:bg-red-700 text-white font-semibold">
              Delete Customer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Customer Deletion Modal */}
      <Dialog open={bulkDeleteConfirm} onOpenChange={setBulkDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Bulk Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the {selectedCount} selected customer records? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setBulkDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleBulkDelete} className="bg-red-650 hover:bg-red-700 text-white font-semibold">
              Delete Selected
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
