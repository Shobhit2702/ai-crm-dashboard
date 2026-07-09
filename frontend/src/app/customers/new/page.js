import React from "react";
import { SectionHeader } from "@/components/common/SectionHeader";
import { CustomerForm } from "@/features/customers/components/CustomerForm";

export const metadata = {
  title: "Add New Customer - CRM Suite",
  description: "Create a new customer profile in your enterprise directory",
};

export default function AddCustomerPage() {
  return (
    <div className="space-y-6">
      {/* Header and Breadcrumbs */}
      <SectionHeader
        breadcrumbs={["Dashboard", "Customers", "Add New"]}
        title="Add New Customer"
        subtitle="Create a new customer profile in your enterprise directory."
      />

      {/* Creation form */}
      <CustomerForm />
    </div>
  );
}
