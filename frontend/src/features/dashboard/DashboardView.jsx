"use client";

import React, { useState } from "react";
import { Plus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/common/SectionHeader";
import { AnalyticsCards } from "./components/AnalyticsCards";
import { CustomerGrowthChart } from "./components/CustomerGrowthChart";
import { CustomerStatusChart } from "./components/CustomerStatusChart";
import { RecentImports } from "./components/RecentImports";
import { RecentCustomers } from "./components/RecentCustomers";
import { ActivityTimeline } from "./components/ActivityTimeline";
import { AddCustomerModal, ImportCSVModal } from "./components/QuickActionsModal";

// Load mock data
import initialMockData from "./data/mockData.json";

function DashboardView() {
  const [dashboardData, setDashboardData] = useState(initialMockData);
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [csvModalOpen, setCsvModalOpen] = useState(false);

  // Dynamic Handlers to make the UI feel alive!
  const handleAddCustomer = (newCustomer) => {
    // Add to Recent Customers
    const updatedCustomers = [
      {
        id: String(Date.now()),
        name: newCustomer.name,
        company: newCustomer.company,
        status: newCustomer.status,
        avatar: "",
      },
      ...dashboardData.recentCustomers,
    ].slice(0, 5); // keep max 5

    // Add to Activity Timeline
    const updatedTimeline = [
      {
        id: String(Date.now()),
        title: "New Customer Added",
        description: `${newCustomer.name} was added by Alex Chen`,
        time: "Just now",
        type: "add",
      },
      ...dashboardData.activityTimeline,
    ];

    // Update stats counters
    const updatedStats = { ...dashboardData.stats };
    updatedStats.totalCustomers.value += 1;
    if (newCustomer.status === "Active") {
      updatedStats.activeCustomers.value += 1;
    }
    updatedStats.newCustomers.value += 1;

    setDashboardData({
      ...dashboardData,
      recentCustomers: updatedCustomers,
      activityTimeline: updatedTimeline,
      stats: updatedStats,
    });
  };

  const handleImportCSV = (newImport) => {
    // Add to Recent Imports
    const updatedImports = [
      {
        id: String(Date.now()),
        filename: newImport.filename,
        records: newImport.records,
        time: newImport.time,
        status: newImport.status,
      },
      ...dashboardData.recentImports,
    ].slice(0, 5);

    // Add to Activity Timeline
    const updatedTimeline = [
      {
        id: String(Date.now()),
        title: "Data Import Completed",
        description: `Imported leads from file: ${newImport.filename}`,
        time: "Just now",
        type: "import",
      },
      ...dashboardData.activityTimeline,
    ];

    setDashboardData({
      ...dashboardData,
      recentImports: updatedImports,
      activityTimeline: updatedTimeline,
    });
  };

  const actions = (
    <>
      <Button
        variant="outline"
        onClick={() => setCsvModalOpen(true)}
        className="flex items-center gap-1.5 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
      >
        <Upload className="h-4 w-4" />
        <span>Import CSV</span>
      </Button>
      
      <Button
        onClick={() => setCustomerModalOpen(true)}
        className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
      >
        <Plus className="h-4 w-4" />
        <span>Add Customer</span>
      </Button>
    </>
  );

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <SectionHeader
        breadcrumbs={["Home", "Dashboard"]}
        title="Analytics Overview"
        subtitle="Welcome back, Alex. Here's what's happening today."
        actions={actions}
      />

      {/* Row 1: Analytics Summary Cards */}
      <AnalyticsCards data={dashboardData.stats} />

      {/* Row 2: Charts Grid */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <CustomerGrowthChart data={dashboardData.customerGrowth} />
        <CustomerStatusChart data={dashboardData.customerStatus} />
      </div>

      {/* Row 3: Bottom Widgets Grid */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <RecentImports data={dashboardData.recentImports} />
        <RecentCustomers data={dashboardData.recentCustomers} />
        <ActivityTimeline data={dashboardData.activityTimeline} />
      </div>

      {/* Modal Dialogs */}
      <AddCustomerModal
        open={customerModalOpen}
        onOpenChange={setCustomerModalOpen}
        onAdd={handleAddCustomer}
      />

      <ImportCSVModal
        open={csvModalOpen}
        onOpenChange={setCsvModalOpen}
        onImport={handleImportCSV}
      />
    </div>
  );
}

export { DashboardView };
