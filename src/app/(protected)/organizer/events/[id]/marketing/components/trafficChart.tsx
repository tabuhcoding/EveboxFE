'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useTranslations } from "next-intl";

interface RawTrafficData {
  weekStart: string;
  visits: number;
}

interface TrafficChartProps {
  data: RawTrafficData[];
}

export default function TrafficChart({ data }: TrafficChartProps) {
  const t = useTranslations("common");

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    return !msg || msg.startsWith("common.") ? fallback : msg;
  };

  // Transform to readable labels for XAxis
  const formattedData = data.map((item) => {
    const start = new Date(item.weekStart);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    const formatDate = (date: Date) =>
      date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });

    return {
      ...item,
      weekRange: `${formatDate(start)} – ${formatDate(end)}`,
    };
  });

  const current = formattedData[formattedData.length - 1];
  const previous = formattedData[formattedData.length - 2];

  let growthText = "0%";
  let growthPositive = true;

  if (current && previous) {
    if (previous.visits === 0) {
      growthText = "+100%";
      growthPositive = true;
    } else {
      const growth = ((current.visits - previous.visits) / previous.visits) * 100;
      growthPositive = growth >= 0;
      growthText = `${growthPositive ? "+" : ""}${growth.toFixed(1)}%`;
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-2">
        {transWithFallback("visitsOverTime", "Lượt truy cập theo thời gian")}
      </h2>
      <p className="text-4xl font-bold">
        {formattedData.reduce((sum, item) => sum + item.visits, 0).toLocaleString()}
      </p>
      <p className="text-blue-500 flex items-center">
        <span className="mr-1">{growthPositive ? "▲" : "▼"}</span>
        {growthText} {transWithFallback("vsLastWeek", "so với tuần trước")}
      </p>

      <div className="mt-4 w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="weekRange" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="visits"
              stroke="#0C4762"
              strokeWidth={3}
              dot
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
