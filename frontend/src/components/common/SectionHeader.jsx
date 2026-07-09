import React from "react"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

function SectionHeader({
  breadcrumbs = [],
  title,
  subtitle,
  actions,
  className,
  ...props
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8",
        className
      )}
      {...props}
    >
      <div className="flex flex-col gap-1.5">
        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <nav className="flex items-center space-x-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={crumb}>
                {idx > 0 && <ChevronRight className="h-3 w-3 text-slate-400" />}
                <span
                  className={cn(
                    idx === breadcrumbs.length - 1
                      ? "text-blue-600 dark:text-blue-400 font-semibold"
                      : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  )}
                >
                  {crumb}
                </span>
              </React.Fragment>
            ))}
          </nav>
        )}

        {/* Title & Subtitle */}
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {subtitle}
          </p>
        )}
      </div>

      {/* Actions */}
      {actions && (
        <div className="flex flex-wrap items-center gap-3">
          {actions}
        </div>
      )}
    </div>
  )
}

export { SectionHeader }
