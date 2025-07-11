'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

/* Components */
import DateRangePicker from "./dateRangePicker";
import TrafficChart from "./trafficChart";
import SidebarOrganizer from "../../_components/sidebarOrganizer";

/* Styles */
import 'tailwindcss/tailwind.css';
import "react-datepicker/dist/react-datepicker.css";

/* Services + Types */
import { getAnalyticByEvent } from "@/services/org.service";
import { AnalyticData } from "@/types/models/org/analytics.interface";

export default function AnalyticsContent() {
  const t = useTranslations('common');
  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    if (!msg || msg.startsWith('common.')) return fallback;
    return msg;
  };

  const params = useParams();
  const eventId = params?.id?.toString() || "";

  const [analytics, setAnalytics] = useState<AnalyticData | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const fetchAnalytics = async () => {
    try {
      const isoStart = startDate?.toISOString();
      const isoEnd = endDate?.toISOString();
      const res = await getAnalyticByEvent(eventId, isoStart, isoEnd);
      setAnalytics(res);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    }
  };

  useEffect(() => {
    if (eventId) {
      fetchAnalytics();
    }
  }, [eventId]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-64 bg-gray-900 text-white">
        <SidebarOrganizer />
      </div>

      <div className="flex-1 p-6">
        <p className="text-sm text-[#51DACF] pt-2">{analytics?.eventTitle}</p>
        <div className="border-t-2 border-[#0C4762] mt-2"></div>

        <div className="flex items-center justify-between mb-6">
          <h3 className="mt-4 text-xl font-bold text-[#0C4762] mb-6">
            {transWithFallback('marketingToolsAndReports', 'Công cụ & Báo cáo Marketing')}
          </h3>
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            onConfirm={fetchAnalytics}
          />
        </div>

        {analytics ? (
          <div>
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <p className="text-3xl font-bold">{analytics.totalClicks}</p>
                <p className="text-gray-500">{transWithFallback('totalClicks', 'Số lượt truy cập')}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <p className="text-3xl font-bold">{analytics.totalUsers}</p>
                <p className="text-gray-500">{transWithFallback('totalUsers', 'Người dùng')}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <p className="text-3xl font-bold">{analytics.totalBuyers}</p>
                <p className="text-gray-500">{transWithFallback('totalBuyers', 'Người mua')}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <p className="text-3xl font-bold">
                  {analytics.totalUsers > 0
                    ? ((analytics.totalBuyers / analytics.totalUsers) * 100).toFixed(2) + "%"
                    : "0%"}
                </p>
                <p className="text-gray-500">{transWithFallback('conversionRate', 'Tỉ lệ chuyển đổi')}</p>
              </div>
            </div>

            <div className="mb-6">
              <TrafficChart data={analytics.statistic || []} />
            </div>
          </div>
        ) : (
          <div className="col-span-4 text-center text-gray-500">
            {transWithFallback('loadingData', 'Đang tải dữ liệu...')}
          </div>
        )}
      </div>
    </div>
  );
}
