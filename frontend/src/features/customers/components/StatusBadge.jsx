import React from "react";
import { Badge } from "@/components/ui/badge";

function StatusBadge({ status, className }) {
  const statusMap = {
    Active: "success",
    Lead: "warning",
    Inactive: "destructive",
  };

  const variant = statusMap[status] || "secondary";

  return (
    <Badge variant={variant} className={className}>
      {status}
    </Badge>
  );
}

export { StatusBadge };
