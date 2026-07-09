import React from "react";
import { FileUp } from "lucide-react";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata = {
  title: "CSV Import - CRM Suite",
  description: "Upload and parse CRM spreadsheets",
};

export default function CSVImportPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        breadcrumbs={["Home", "CSV Import"]}
        title="CSV Import"
        subtitle="Batch upload contacts, leads, and customer details."
      />
      
      <Card>
        <CardContent className="pt-6">
          <EmptyState
            icon={FileUp}
            title="CSV Parser Engine"
            description="Upload spreadsheet databases to batch parse and load data directly into CRM records. Trigger the parser simulator from the Dashboard."
          />
        </CardContent>
      </Card>
    </div>
  );
}
