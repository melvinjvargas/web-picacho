"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DataPoint {
  name: string;
  value: number;
  fill?: string;
}

interface SimpleBarChartProps {
  data: DataPoint[];
  height?: number;
}

export function SimpleBarChart({ data, height = 300 }: SimpleBarChartProps) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 4 }}>
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: "#6B6B6B" }}
            axisLine={{ stroke: "#E8E8E8" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#6B6B6B" }}
            axisLine={{ stroke: "#E8E8E8" }}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid #E8E8E8",
              fontSize: "13px",
            }}
          />
          <Bar
            dataKey="value"
            radius={[6, 6, 0, 0]}
            fill="#2D4A32"
            maxBarSize={48}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
