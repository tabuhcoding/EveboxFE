'use client';

/* Package System */
import { useTranslations } from "next-intl";
import { useState } from "react";
import { CircularProgress } from "@mui/material";

/* Package Application */
import { TabsProps } from "@/types/models/admin/eventManagement.interface";

export default function Tabs({ activeTab, setActiveTab, loading }: TabsProps) {
  const t = useTranslations('common');
  const [loadingTabId, setLoadingTabId] = useState<string | null>(null);

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    return !msg || msg.startsWith('common.') ? fallback : msg;
  };

  const tabs = [
    { id: "all", label: transWithFallback('all', 'Tất cả') },
    { id: "pending", label: transWithFallback('pending', 'Chờ duyệt') },
    { id: "approved", label: transWithFallback('approved', 'Đã duyệt') },
    { id: "deleted", label: transWithFallback('deleted', 'Đã xóa') }
  ];

  const handleTabClick = async (tabId: string) => {
    if (tabId === activeTab) return;
    setLoadingTabId(tabId);
    await setActiveTab(tabId);
    setLoadingTabId(null);
  };

  return (
    <div className="tabs-event-management flex justify-end space-x-4 mt-6 text-sm">
      {tabs.map(tab => {
        const isActive = activeTab === tab.id;
        const isLoading = loadingTabId === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            disabled={loading}
            className={`px-6 py-2 rounded-full flex items-center gap-2 transition-colors
              ${isActive ? 'bg-[#0C4762] text-[#9EF5CF]' : 'bg-[#9EF5CF] text-gray-700'}
              ${isLoading ? 'opacity-75 cursor-wait' : ''}
            `}
          >
            {loading && tab.id === activeTab ? (
              <CircularProgress size={16} color="inherit" />
            ) : null}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}