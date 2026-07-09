import React from "react"
import { ArrowUpRight, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

function StatCard({
  title,
  value,
  icon: Icon,
  iconClass = "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400",
  trend,
  trendType = "text", // "text" | "badge" | none
  className,
  ...props
}) {
  return (
    <Card className={cn("hover:shadow-md transition-shadow duration-200", className)} {...props}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase dark:text-slate-500">
              {title}
            </span>
            <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {value}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Trend tag */}
            {trend && trendType === "text" && (
              <div className="flex items-center gap-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="h-3 w-3" />
                <span>{trend}</span>
              </div>
            )}
            {trend && trendType === "badge" && (
              <Badge variant="success" className="px-2 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-700 border-none dark:bg-emerald-950/30 dark:text-emerald-400">
                {trend}
              </Badge>
            )}

            {/* Icon */}
            {Icon && (
              <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", iconClass)}>
                <Icon className="h-5 w-5" />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export { StatCard }
