import React from "react";
import { DashboardView } from "@/features/dashboard/DashboardView";

export const metadata = {
  title: "Dashboard - CRM Suite",
  description: "Enterprise tier CRM Analytics Dashboard",
};

export default function DashboardPage() {
  return <DashboardView />;
}
