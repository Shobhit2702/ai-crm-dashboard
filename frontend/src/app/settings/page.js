import React from "react";
import { Settings, Info } from "lucide-react";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata = {
  title: "Settings - CRM Suite",
  description: "Configure your enterprise CRM preferences",
};

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        breadcrumbs={["Home", "Settings"]}
        title="Settings"
        subtitle="Manage user configurations, system variables, and application parameters."
      />
      
      <Card>
        <CardContent className="pt-6">
          <EmptyState
            icon={Settings}
            title="System Preferences"
            description="Manage authentication integrations, API token variables, security audits, and application display toggles (light/dark mode toggle is also available in the top navbar profile dropdown)."
          />
        </CardContent>
      </Card>
    </div>
  );
}
