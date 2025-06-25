'use client';

/* Package System */
import { useTranslations } from "next-intl";

/* Package Application */
import { TabsProps } from "@/types/models/admin/eventManagement.interface";

export default function Tabs({ activeTab, setActiveTab }: TabsProps) {
  const t = useTranslations('common');

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

  return (
    <div className="tabs-event-management flex justify-end space-x-4 mt-6 text-sm">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`px-6 py-2 rounded-full ${activeTab === tab.id ? 'bg-[#0C4762] text-[#9EF5CF]' : 'bg-[#9EF5CF] text-gray-700'}`}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}