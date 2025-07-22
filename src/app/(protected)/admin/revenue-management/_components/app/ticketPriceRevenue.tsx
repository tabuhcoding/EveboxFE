'use client';

/* Package System */
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

/* Package Application */
import { useAuth } from "@/contexts/auth.context";
import { getOrgRevenueByTicketPrice } from "@/services/event.service";
import { RevenueByTicketPriceData } from "@/types/models/admin/revenueManagement.interface";
import { AIAnalyst } from "./ai-analyst";

export default function TicketPriceRevenueView() {
  const t = useTranslations("common");
  const { session } = useAuth();

  const [data, setData] = useState<RevenueByTicketPriceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getOrgRevenueByTicketPrice(session?.user?.accessToken);
        
        if (res.statusCode !== 200) {
          setData([]);
          return;
        }

        setData(res.data);
      } catch (error) {
        console.error("Failed to fetch revenue by ticket price:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    return !msg || msg.startsWith('common.') ? fallback : msg;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount);
  };

  const chartData = data.map((item, index) => ({
    label: `${index + 1}`,
    revenue: Math.floor((item.revenue / 1_000)),
    conversion: item.conversionRate * 100,
  }));

  if (loading) {
    return (
      <div className="flex-1 p-6 md-64 w-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0C4762] mx-auto"></div>
          <p className="mt-4 text-[#0C4762]">{transWithFallback("loadingData", "Đang tải dữ liệu...")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-700">{transWithFallback('millionVND', 'triệu đồng')}</h3>
          <h3 className="text-lg font-medium text-gray-700">{transWithFallback('conversionRate', 'Tỉ lệ chuyển đổi')}</h3>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis dataKey="label" />
              <YAxis
                yAxisId="left"
                axisLine={false}
                tickLine={false}
                domain={[0, "auto"]}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                axisLine={false}
                tickLine={false}
                domain={[0, 100]}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                formatter={(value: number, name: string) => {
                  if (name === "revenue") {
                    return [`${value.toFixed(2)} tr.₫`, transWithFallback("revenue", "Doanh thu")];
                  }
                  if (name === "conversion") {
                    return [`${value.toFixed(1)}%`, transWithFallback("conversionRate", "Tỉ lệ chuyển đổi")];
                  }
                  return [value, name];
                }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="revenue"
                stroke="#0EA5E9"
                strokeWidth={3}
                dot={false}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="conversion"
                stroke="#8B5CF6"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>

        </div>

        <div className="flex justify-center mt-4 space-x-8">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-[#0EA5E9] mr-2"></div>
            <span className="text-sm text-gray-600">{transWithFallback("revenue", "Doanh thu")}</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-[#8B5CF6] mr-2"></div>
            <span className="text-sm text-gray-600">{transWithFallback("conversionRate", "Tỉ lệ chuyển đổi")}</span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <AIAnalyst type = {"price"}/>
      </div>
      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#0C4762] text-white">
              <th className="py-3 px-4 text-left">{transWithFallback('noStt', 'STT')}</th>
              <th className="py-3 px-4 text-left">{transWithFallback('ticketPriceThousandVND', 'Giá vé')}</th>
              <th className="py-3 px-4 text-left">{transWithFallback('totalTickets', 'Tổng số lượng vé')}</th>
              <th className="py-3 px-4 text-left">{transWithFallback('actualSoldTicket', 'Số vé thực bán')}</th>
              <th className="py-3 px-4 text-left">{transWithFallback('conversionRate', 'Tỉ lệ chuyển đổi')}</th>
              <th className="py-3 px-4 text-left">{transWithFallback('totalRevenue', 'Tổng doanh thu')}</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr
                key={idx}
                className="border-b border-gray-200 hover:bg-[#E8FFFF]"
              >
                <td className="py-3 px-4">{idx + 1}</td>
                <td className="py-3 px-4">
                  [{row.minPrice.toLocaleString("vi-VN")} - {row.maxPrice.toLocaleString("vi-VN")}₫]
                </td>
                <td className="py-3 px-4">{row.total}</td>
                <td className="py-3 px-4">{row.sold}</td>
                <td className="py-3 px-4">
                  {(row.conversionRate * 100).toFixed(0)}%
                </td>
                <td className="py-3 px-4">{formatCurrency(row.revenue*1000)}₫</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}