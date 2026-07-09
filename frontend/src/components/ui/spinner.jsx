import React from "react"
import { cn } from "@/lib/utils"

function Spinner({ className, size = "md", ...props }) {
  const sizeClasses = {
    xs: "h-3 w-3 border",
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-8 w-8 border-3",
  }

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent",
        sizeClasses[size] || sizeClasses.md,
        className
      )}
      role="status"
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

export { Spinner }
