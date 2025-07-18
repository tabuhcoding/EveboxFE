"use client";

/* Package System */
import { useTranslations } from "next-intl";
import { ChevronDown, Filter, RotateCcw } from "lucide-react";
import { useState } from "react";

/* Package Application */
import { FilterProps } from "@/types/models/admin/showingManagement.interface";

export default function FilterBar({
  dateFrom, dateTo,
  onDateFromChange, onDateToChange,
  onReset
}: FilterProps) {
  const t = useTranslations('common');

  const [showDateFilter, setShowDateFilter] = useState(false);

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    if (!msg || msg.startsWith('common.')) return fallback;
    return msg;
  };

  return (
    <div className="filter-showing-management flex items-center gap-2 bg-white border rounded-lg px-2 py-4 shadow-sm">
      {/* Filter - Ngày bắt đầu - kết thúc */}
      <div className="filter-created-btn relative pr-2">
        <div className="flex items-center gap-1 cursor-pointer text-sm"
          onClick={() => setShowDateFilter(!showDateFilter)}
        >
          <span className="text-black font-semibold">{transWithFallback('showDate', 'Ngày diễn')}</span>
          <ChevronDown size={16} />
        </div>

        {showDateFilter && (
          <div className="absolute left-0 mt-2 bg-white shadow-lg rounded-md p-4 flex flex-col gap-3 z-10 border w-60 text-sm">
            <div className="flex items-center gap-2">
              <label className="text-black font-semibold">{transWithFallback('from', 'Từ ngày')}</label>
              <input type="date" className="border px-2 py-1 rounded-md"
                value={dateFrom}
                onChange={(e) => onDateFromChange(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="text-black font-semibold">{transWithFallback('to', 'Đến ngày')}</label>
              <input type="date" value={dateTo} className="border px-2 py-1 rounded-md"
                onChange={(e) => onDateToChange(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Reset Filter */}
      <div onClick={onReset} className="reset-filter-btn flex items-center gap-1 border-l pl-4 pr-2 text-red-500 cursor-pointer hover:underline ml-auto">
        <RotateCcw size={16} />
        <span>{transWithFallback('resetFilter', 'Thiết lập lại bộ lọc')}</span>
      </div>
    </div>
  )
}