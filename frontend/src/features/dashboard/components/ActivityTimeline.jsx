import React from "react";
import { Plus, Database, ShieldAlert, Key } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const ICONS = {
  add: { icon: Plus, bg: "bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400" },
  import: { icon: Database, bg: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400" },
  security: { icon: Key, bg: "bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400" },
};

function ActivityTimeline({ data }) {
  return (
    <Card className="col-span-1 flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-slate-800 dark:text-slate-100">
          Activity Timeline
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1">
        <div className="relative border-l border-slate-100 pl-6 space-y-6 dark:border-slate-800 ml-3">
          {data && data.map((item, idx) => {
            const config = ICONS[item.type] || { icon: Database, bg: "bg-slate-100 text-slate-600" };
            const Icon = config.icon;

            return (
              <div key={item.id} className="relative">
                {/* Timeline node icon */}
                <span className={cn(
                  "absolute -left-9 flex h-6 w-6 items-center justify-center rounded-full ring-4 ring-white dark:ring-slate-950",
                  config.bg
                )}>
                  <Icon className="h-3.5 w-3.5" />
                </span>

                {/* Timeline Item Details */}
                <div className="flex flex-col gap-0.5">
                  <h4 className="text-xs font-bold text-slate-850 dark:text-slate-200">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {item.description}
                  </p>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                    {item.time}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export { ActivityTimeline };
