"use client";

import React, { useState, useEffect } from "react";
import { ResponsiveContainer, ComposedChart, Area, Bar, XAxis, Tooltip, Cell } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useTheme } from "@/context/ThemeContext";

function CustomerGrowthChart({ data }) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-md font-semibold">Customer Growth</CardTitle>
          <div className="h-8 w-24 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
        </CardContent>
      </Card>
    );
  }

  // Custom tooltips matching CRM theme
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-slate-100 bg-white p-3 shadow-md dark:border-slate-800 dark:bg-slate-950 text-xs">
          <p className="font-semibold text-slate-800 dark:text-slate-200">
            {payload[0].payload.month}
          </p>
          <p className="text-blue-600 dark:text-blue-400">
            Customers: <span className="font-bold">{payload[1]?.value || payload[0]?.value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const isDark = theme === "dark";

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-base font-semibold text-slate-800 dark:text-slate-100">
          Customer Growth
        </CardTitle>
        <select className="text-xs bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1 text-slate-600 focus:outline-hidden dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400">
          <option>Last 6 months</option>
          <option>Last year</option>
        </select>
      </CardHeader>
      <CardContent className="px-2 pb-0">
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
            >
              <defs>
                <linearGradient id="growthAreaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={isDark ? 0.15 : 0.08} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: isDark ? "#64748b" : "#94a3b8", fontSize: 12 }}
                dy={10}
              />

              <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />

              {/* Background smooth area wave */}
              <Area
                type="monotone"
                dataKey="backgroundWave"
                stroke={isDark ? "#4f46e5" : "#c7d2fe"}
                strokeWidth={1.5}
                fill="url(#growthAreaGradient)"
                activeDot={false}
              />

              {/* Vertical Bars */}
              <Bar
                dataKey="customers"
                barSize={12}
                radius={[6, 6, 0, 0]}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.highlight ? (isDark ? "#6366f1" : "#4f46e5") : (isDark ? "#312e81" : "#c7d2fe")}
                  />
                ))}
              </Bar>
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export { CustomerGrowthChart };
