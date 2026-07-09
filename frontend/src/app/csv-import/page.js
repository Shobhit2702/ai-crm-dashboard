import React from "react";
import { CSVImportView } from "@/features/csv-import/CSVImportView";

export const metadata = {
  title: "CSV Import - CRM Suite",
  description: "Upload and parse CRM spreadsheets locally",
};

export default function CSVImportPage() {
  return <CSVImportView />;
}
