'use client';

/* Package System */
import { useTranslations } from "next-intl";

/* Package Application */
import { RevenueTabsProps } from "@/types/models/admin/revenueManagement.interface";

export default function RevenueTabs({ activeTab, onTabChange }: RevenueTabsProps) {
  const t = useTranslations('common');

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    if (!msg || msg.startsWith('common.')) return fallback;
    return msg;
  }

  return (
    <div className="flex justify-center">
      <div className="flex justify-between w-full max-w-4xl">
        <button
          onClick={() => onTabChange("app")}
          className={`px-6 py-3 rounded-full text-center transition-colors min-w-[200px] ${
            activeTab === "app" ? "bg-[#0C4762] text-white" : "bg-[#a8e6cf] text-gray-700 hover:bg-[#8ddfc4]"
          }`}
        >
          {transWithFallback('appRevenue', 'Doanh thu ứng dụng')}
        </button>
        <button
          onClick={() => onTabChange("organization")}
          className={`px-6 py-3 rounded-full text-center transition-colors min-w-[200px] ${
            activeTab === "organization" ? "bg-[#0C4762] text-white" : "bg-[#a8e6cf] text-gray-700 hover:bg-[#8ddfc4]"
          }`}
        >
          {transWithFallback('orgRevenue', 'Doanh thu nhà tổ chức')}
        </button>
        <button
          onClick={() => onTabChange("event")}
          className={`px-6 py-3 rounded-full text-center transition-colors min-w-[200px] ${
            activeTab === "event" ? "bg-[#0C4762] text-white" : "bg-[#a8e6cf] text-gray-700 hover:bg-[#8ddfc4]"
          }`}
        >
          {transWithFallback('eventRevenue', 'Doanh thu sự kiện')}
        </button>
      </div>
    </div>
  )
}