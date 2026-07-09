import React from "react";
import { cn } from "@/lib/utils";
import { StatusBadge } from "./StatusBadge";

// Helper to get initials
const getInitials = (name) => {
  if (!name) return "U";
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
};

function CustomerAvatar({
  avatar,
  name,
  status,
  size = "md",
  showStatusBadge = false,
  className,
}) {
  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-24 w-24 text-2xl",
  };

  const initials = getInitials(name);

  return (
    <div className={cn("relative inline-block shrink-0", className)}>
      {avatar ? (
        <img
          src={avatar}
          alt={name}
          className={cn(
            "rounded-2xl object-cover border border-slate-100 dark:border-slate-800",
            sizeClasses[size]
          )}
        />
      ) : (
        <div
          className={cn(
            "flex items-center justify-center rounded-2xl font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-100 dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-900/40",
            sizeClasses[size]
          )}
        >
          {initials}
        </div>
      )}

      {/* Overlay Status Badge at the bottom center (for Profile cards) */}
      {showStatusBadge && status && (
        <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 z-10 shrink-0">
          <StatusBadge
            status={status}
            className="px-2 py-0.5 text-[9px] uppercase tracking-wider font-extrabold border-2 border-white shadow-sm dark:border-slate-950"
          />
        </div>
      )}
    </div>
  );
}

export { CustomerAvatar };
