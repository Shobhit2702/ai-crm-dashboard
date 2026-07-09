import React from "react";
import { Users, Info } from "lucide-react";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata = {
  title: "Customers - CRM Suite",
  description: "Manage CRM customers and profiles",
};

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        breadcrumbs={["Home", "Customers"]}
        title="Customers"
        subtitle="View, search, and manage all customer records in one place."
      />
      
      <Card>
        <CardContent className="pt-6">
          <EmptyState
            icon={Users}
            title="No Customers Found"
            description="Customers will appear here once you add them or import profiles from a CSV file. Go to the Dashboard to add your first customer."
          />
        </CardContent>
      </Card>
    </div>
  );
}
