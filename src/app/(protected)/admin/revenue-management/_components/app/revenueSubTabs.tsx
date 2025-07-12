'use client';

/* Package System */
import { useTranslations } from "next-intl";

/* Package Application */
import { RevenueSubTabsProps } from "@/types/models/admin/revenueManagement.interface";

export default function RevenueSubTabs({ activeSubTab, onSubTabChange }: RevenueSubTabsProps) {
  const t = useTranslations("common");

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    if (!msg || msg.startsWith('common.')) return fallback;
    return msg;
  }

  return (
    <div className="flex justify-center border-b mb-4 space-x-8 mt-4">
      <button
        onClick={() => onSubTabChange("day")}
        className={`py-2 px-4 text-sm font-medium relative ${
            activeSubTab === "day" 
              ? "text-[#0C4762] border-b-2 border-[#0C4762]" 
              : "text-gray-600 hover:text-[#0C4762]"
          }`}
      >
        {transWithFallback('byDate', 'Theo ngày')}
      </button>
      <button
        onClick={() => onSubTabChange("location")}
        className={`
          "py-2 px-4 text-sm font-medium relative",
          ${activeSubTab === "location"
            ? "text-[#0C4762] border-b-2 border-[#0C4762]"
            : "text-gray-600 hover:text-[#0C4762]"
          }`}
      >
        {transWithFallback('byProvince', 'Theo tỉnh thành')}
      </button>
      <button
        onClick={() => onSubTabChange("price")}
        className={`
          "py-2 px-4 text-sm font-medium relative",
          ${activeSubTab === "price"
            ? "text-[#0C4762] border-b-2 border-[#0C4762]"
            : "text-gray-600 hover:text-[#0C4762]"
          }`}
      >
        {transWithFallback('byTicketPrice', 'Theo giá vé')}
      </button>
    </div>
  )
}
