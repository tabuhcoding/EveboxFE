'use client';

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Dot } from "recharts";

interface TrafficChartProps {
  data: { month: string; visits: number }[];
}

export default function TrafficChart({ data }: TrafficChartProps) {
  const currentMonth = data[data.length - 1];
  const lastMonth = data[data.length - 2];

  let growthText = "0%";
  let growthPositive = true;

  if (currentMonth && lastMonth) {
    if (lastMonth.visits === 0) {
      // Edge case: No visits last month
      growthText = "+100%";
      growthPositive = true;
    } else {
      const growth = ((currentMonth.visits - lastMonth.visits) / lastMonth.visits) * 100;
      growthPositive = growth >= 0;
      growthText = `${growthPositive ? "+" : ""}${growth.toFixed(1)}%`;
    }
  }
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-2">Lượt truy cập theo thời gian</h2>
      <p className="text-4xl font-bold">{data.reduce((sum, item) => sum + item.visits, 0).toLocaleString()}</p>
      <p className="text-blue-500 flex items-center">
      <span className="mr-1">{growthPositive ? "▲" : "▼"}</span>
      {growthText} so với tháng trước
      </p>

      {/* Chart */}
      <div className="mt-4 w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="visits"
              stroke="#0C4762"
              strokeWidth={3}
              dot={(props) => (
                <Dot
                  {...props}
                  fill={props.payload.month === "January" ? "blue" : "#0C4762"}
                  r={props.payload.month === "January" ? 6 : 3}
                />
              )}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
