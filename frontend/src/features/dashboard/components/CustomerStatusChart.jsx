"use client";

import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useTheme } from "@/context/ThemeContext";

function CustomerStatusChart({ data }) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="text-md font-semibold">Customer Status</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
        </CardContent>
      </Card>
    );
  }

  const isDark = theme === "dark";
  const colors = {
    Active: isDark ? "#0ea5e9" : "#0d9488",
    Pending: "#f59e0b",
    Inactive: "#dc2626",
  };

  return (
    <Card className="col-span-1 flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-slate-800 dark:text-slate-100">
          Customer Status
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex flex-col flex-1 items-center justify-center p-6">
        {/* Donut Container */}
        <div className="relative h-[180px] w-[180px] mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[entry.name] || entry.color}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Centered text label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-slate-800 dark:text-slate-100 leading-none">
              1.8k
            </span>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider uppercase mt-1">
              Active
            </span>
          </div>
        </div>

        {/* Legend List */}
        <div className="w-full space-y-2 text-xs">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: colors[item.name] || item.color }}
                />
                <span className="font-medium text-slate-700 dark:text-slate-300">{item.name}</span>
              </div>
              <span className="font-bold text-slate-800 dark:text-slate-200">{item.value}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export { CustomerStatusChart };
