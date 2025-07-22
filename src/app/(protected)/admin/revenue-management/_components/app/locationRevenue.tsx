'use client';

/* Package System */
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

/* Package Application */
import { useAuth } from "@/contexts/auth.context";
import { getOrgRevenueByProvince } from "@/services/event.service";
import { ProvinceRevenueData } from "@/types/models/admin/revenueManagement.interface";
import { AIAnalyst } from "./ai-analyst";

interface ProvinceGroupedData {
  area_code: string;
  [provinceName: string]: number | string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-300 px-3 py-2 rounded shadow max-h-60 overflow-y-auto w-64">
        <p className="text-sm text-gray-700 font-medium mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm text-[#0C4762]">
            {entry.name}: {new Intl.NumberFormat("vi-VN").format(entry.value)}tr.đ
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function LocationRevenueView() {
  const t = useTranslations("common");
  const { session } = useAuth();

  const [provinceData, setProvinceData] = useState<ProvinceRevenueData[]>([]);
  const [provinceDataMap, setProvinceDataMap] = useState<ProvinceGroupedData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProvinceRevenue = async () => {
      try {
        const res = await getOrgRevenueByProvince(session?.user?.accessToken || "");
        setProvinceData(res.data);

        const groupedData = Object.values(
          res.data.reduce((acc: Record<string, { area_code: string; [provinceName: string]: number | string }>, curr) => {
            if (!acc[curr.area_code]) acc[curr.area_code] = { area_code: curr.area_code, area: curr.area_code };
            acc[curr.area_code][curr.provinceName] = curr.totalRevenue / 1_000_000;
            return acc;
          }, {})
        );

        setProvinceDataMap([
          ...provinceDataMap,
          ...groupedData,
          ]
        );

        console.log("Province Data Map:", groupedData);
      } catch (error) {
        console.error("Failed to fetch province revenue data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProvinceRevenue();
  }, []);

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    return !msg || msg.startsWith('common.') ? fallback : msg;
  };

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
      {/* Chart */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-medium text-gray-700 mb-4">{transWithFallback('millionVND', 'triệu đồng')}</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={provinceDataMap}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal vertical={false} />
              <XAxis dataKey="area" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />

              {/* Tạo 1 <Bar /> cho mỗi tỉnh */}
              {Array.from(new Set(provinceData.map((p) => p.provinceName))).map((province, idx) => (
                <Bar
                  key={province}
                  dataKey={province}
                  stackId="a"
                  fill={['#0C4762', '#178CA4', '#F4B942', '#9AD0C2'][idx % 4]}
                  name={province}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mb-6">
        <AIAnalyst type = {"location"}/>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#0C4762] text-white">
              <th className="py-3 px-4 text-left font-medium">STT</th>
              <th className="py-3 px-4 text-left font-medium">Tỉnh thành</th>
              <th className="py-3 px-4 text-left font-medium">Province</th>
              <th className="py-3 px-4 text-left font-medium">Số lượng sự kiện</th>
              <th className="py-3 px-4 text-left font-medium">Số lượng showing</th>
              <th className="py-3 px-4 text-left font-medium">Tổng doanh thu</th>
              <th className="py-3 px-4 text-left font-medium">Khu vực</th>
            </tr>
          </thead>
          <tbody>
            {provinceData.map((row, index) => (
              <tr key={index} className="border-b border-gray-200 hover:bg-[#E8FFFF]">
                <td className="py-3 px-4">{index + 1}</td>
                <td className="py-3 px-4">{row.provinceName}</td>
                <td className="py-3 px-4">{row.provinceEnName}</td>
                <td className="py-3 px-4">{row.eventCount}</td>
                <td className="py-3 px-4">{row.showingCount}</td>
                <td className="py-3 px-4">{new Intl.NumberFormat("vi-VN").format(row.totalRevenue*1000)}</td>
                <td className="py-3 px-4">{row.area_code}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}