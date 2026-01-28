import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ChartTitle = ({ title, data = [], colors = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("Daily");

  return (
    <div className="bg-lightest-blue p-5 border-3 border-white rounded-xl h-80">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>

        {/* Dropdown placeholder (future ready) */}
        <div className="relative w-28 text-sm"></div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={260}>
        <BarChart
          data={data}
          barCategoryGap="20%"     // 🔥 Less gap → wider bars
          margin={{ top: 15, left: 0, right: 0, bottom: 15 }}
        >
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{
              fontSize: 11,
              fill: "#6b7280",
              fontWeight: 500,
            }}
            padding={{ left: 30, right: 30 }}
          />

          <YAxis hide />

          <Tooltip
            formatter={(value) => [
              `${Number(value).toFixed(1)} Tons`,
              "Daily Waste",
            ]}
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "12px",
              fontSize: "12px",
            }}
          />

          <Bar
            dataKey="value"
            barSize={36}            // 🔥 Thicker bars
            maxBarSize={42}
            name="Waste Cleared"
            shape={(props) => {
              const { x, y, width, height, index } = props;
              const colorObj = colors[index % colors.length] || colors[0];
              const { fill, stroke } =
                typeof colorObj === "object"
                  ? colorObj
                  : { fill: colorObj, stroke: "#374151" };

              const barWidth = Math.min(width - 4, 42);

              return (
                <g>
                  <rect
                    x={x + (width - barWidth) / 2}
                    y={y}
                    width={barWidth}
                    height={height}
                    fill={fill}
                    rx={6}
                  />
                  <line
                    x1={x + (width - barWidth) / 2}
                    x2={x + (width + barWidth) / 2}
                    y1={y}
                    y2={y}
                    stroke={stroke}
                    strokeWidth={2}
                    strokeLinecap="round"
                  />
                </g>
              );
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartTitle;
