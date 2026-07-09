import React from "react";
import { Users, UserPlus, Zap, Database } from "lucide-react";
import { StatCard } from "@/components/common/StatCard";

function AnalyticsCards({ data }) {
  if (!data) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Customers */}
      <StatCard
        title={data.totalCustomers.label}
        value={data.totalCustomers.value.toLocaleString()}
        icon={Users}
        iconClass="bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
        trend={data.totalCustomers.change}
        trendType="text"
      />

      {/* New Customers */}
      <StatCard
        title={data.newCustomers.label}
        value={data.newCustomers.value.toLocaleString()}
        icon={UserPlus}
        iconClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
        trend={data.newCustomers.change}
        trendType="badge"
      />

      {/* Active Customers */}
      <StatCard
        title={data.activeCustomers.label}
        value={data.activeCustomers.value.toLocaleString()}
        icon={Zap}
        iconClass="bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400"
      />

      {/* Imported Records */}
      <StatCard
        title={data.importedRecords.label}
        value={data.importedRecords.value}
        icon={Database}
        iconClass="bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400"
      />
    </div>
  );
}

export { AnalyticsCards };
