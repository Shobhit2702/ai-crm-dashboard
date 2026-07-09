"use client";

import React, { useState } from "react";
import { Plus, Database, Key, Edit3, Tag, User, HelpCircle, ChevronDown, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Map types to icons and color classes
const ICONS = {
  import: {
    icon: Database,
    bg: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-450",
  },
  edit: {
    icon: Edit3,
    bg: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-350",
  },
  tag: {
    icon: Tag,
    bg: "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-450",
  },
  user: {
    icon: User,
    bg: "bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-450",
  },
};

function CustomerTimeline({ history = [] }) {
  const [visibleCount, setVisibleCount] = useState(3);

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 3, history.length));
  };

  const visibleHistory = history.slice(0, visibleCount);
  const hasMore = history.length > visibleCount;

  return (
    <div className="flex flex-col flex-1">
      {/* Activity Timeline List */}
      <div className="relative border-l border-slate-100 pl-6 space-y-6 dark:border-slate-850 ml-3">
        {visibleHistory.map((item) => {
          const config = ICONS[item.icon] || { icon: HelpCircle, bg: "bg-slate-50 text-slate-550" };
          const Icon = config.icon;

          return (
            <div key={item.id} className="relative">
              {/* Node Icon */}
              <span className={cn(
                "absolute -left-9 flex h-6 w-6 items-center justify-center rounded-full ring-4 ring-white dark:ring-slate-950",
                config.bg
              )}>
                <Icon className="h-3.5 w-3.5" />
              </span>

              {/* Card content container */}
              <div className="rounded-xl border border-slate-100/60 bg-slate-50/20 p-4 dark:border-slate-850/60 dark:bg-slate-900/10">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {item.title}
                  </h4>
                  <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                    {item.time}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.description}
                </p>

                {/* Optional Status Badges */}
                {(item.type === "system" || item.status) && (
                  <div className="flex flex-wrap items-center gap-1.5 mt-3">
                    {item.type && (
                      <Badge variant="outline" className="px-1.5 py-0.5 text-[9px] uppercase tracking-wider font-extrabold border-slate-200 bg-white text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                        {item.type}
                      </Badge>
                    )}
                    {item.status === "success" && (
                      <Badge variant="success" className="px-1.5 py-0.5 text-[9px] uppercase tracking-wider font-extrabold border-none bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-450">
                        success
                      </Badge>
                    )}
                  </div>
                )}

                {/* Optional update author details */}
                {item.author && (
                  <div className="flex items-center gap-1.5 mt-3 text-[10px] font-semibold text-slate-450 dark:text-slate-500">
                    <User className="h-3 w-3" />
                    <span>Updated by {item.author}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center mt-6">
          <Button
            variant="outline"
            onClick={handleLoadMore}
            className="flex items-center gap-1 border-slate-200 bg-white text-slate-650 hover:bg-slate-50 dark:border-slate-850 dark:bg-slate-950 dark:text-slate-350 text-xs px-4"
          >
            <span>Load Older Activity</span>
            <ChevronDown className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
}

export { CustomerTimeline };
