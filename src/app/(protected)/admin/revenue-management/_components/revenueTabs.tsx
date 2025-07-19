'use client';

/* Package System */
import { useTranslations } from "next-intl";
import { CircularProgress } from "@mui/material";

/* Package Application */
import { RevenueTabsProps } from "@/types/models/admin/revenueManagement.interface";

export default function RevenueTabs({ activeTab, onTabChange, loading }: RevenueTabsProps) {
  const t = useTranslations('common');

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    if (!msg || msg.startsWith('common.')) return fallback;
    return msg;
  }

  const renderButton = (tabKey: "app" | "organization" | "event", label: string) => {
    const isActive = activeTab === tabKey;

    return (
      <button
        onClick={() => !loading && onTabChange(tabKey)}
        disabled={loading}
        className={`px-6 py-3 rounded-full text-center transition-colors min-w-[200px] flex items-center justify-center gap-2
          ${isActive ? "bg-[#0C4762] text-white" : "bg-[#a8e6cf] text-gray-700 hover:bg-[#8ddfc4]"}
          ${loading ? "opacity-70 cursor-wait" : ""}
        `}
      >
        {loading && isActive && <CircularProgress size={18} color="inherit" />}
        {label}
      </button>
    );
  };

  return (
    <div className="flex justify-center">
      <div className="flex justify-between w-full max-w-4xl">
        {renderButton("app", transWithFallback('appRevenue', 'Doanh thu ứng dụng'))}
        {renderButton("organization", transWithFallback('orgRevenue', 'Doanh thu nhà tổ chức'))}
        {renderButton("event", transWithFallback('eventRevenue', 'Doanh thu sự kiện'))}
      </div>
    </div>
  );
}