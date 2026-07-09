import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// Simple fallback initial generator
const getInitials = (name) => {
  if (!name) return "";
  const parts = name.split(" ");
  return parts.map((p) => p[0]).join("").substring(0, 2).toUpperCase();
};

const AVATARS = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=256&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256&auto=format&fit=crop"
];

function RecentCustomers({ data }) {
  return (
    <Card className="col-span-1 flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-slate-800 dark:text-slate-100">
          Recent Customers
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 space-y-4">
        {data && data.map((item, idx) => {
          const avatarUrl = item.avatar || AVATARS[idx % AVATARS.length];
          const isActive = item.status === "Active";

          return (
            <div key={item.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                {/* User Avatar */}
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={item.name}
                    className="h-10 w-10 shrink-0 rounded-full object-cover border border-slate-100 dark:border-slate-850"
                  />
                ) : (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-sm font-semibold dark:bg-blue-950/60 dark:text-blue-400">
                    {getInitials(item.name)}
                  </div>
                )}

                {/* Name & Company */}
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {item.name}
                  </span>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">
                    {item.company}
                  </span>
                </div>
              </div>

              {/* Status Badge */}
              <Badge variant={isActive ? "success" : "warning"} className="px-2.5 py-0.5 text-[10px] font-bold">
                {item.status}
              </Badge>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

export { RecentCustomers };
