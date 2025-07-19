"use client";

/* Package System */
import { useTranslations } from "next-intl";
import { ChevronDown, RotateCcw } from "lucide-react";
import { useState, useEffect } from "react";

/* Package Application */
import { FilterProps } from "@/types/models/admin/eventManagement.interface";
import { Category } from "@/types/models/dashboard/frontDisplay";

import { getAllCategories } from "@/services/event.service";
import { getAllAdmin } from "@/services/auth.service";

export default function FilterBar({
  categoryFilter, onCategoryChange,
  dateFrom, dateTo,
  onDateFromChange, onDateToChange,
  adminFilter, onAdminChange,
  onReset
}: FilterProps) {
  const t = useTranslations('common');

  const [categories, setCategories] = useState<Category[]>([]);
  const [showDateFilter, setShowDateFilter] = useState(false);

  const [admins, setAdmins] = useState<string[]>([]);

useEffect(() => {
  const loadAdmins = async () => {
    try {
      const data = await getAllAdmin();
      setAdmins(data);
    } catch (error) {
      console.error("Failed to load admins:", error);
    }
  };

  loadAdmins();
}, []);

  useEffect(() => {
    const loadCategories = async () => {
      const data = await getAllCategories();
      setCategories(data);
    };

    loadCategories();
  }, []);

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    if (!msg || msg.startsWith('common.')) return fallback;
    return msg;
  };

  const standardCateogry = (cate: string): string => {
    switch(cate) {
      case 'music': 
        return transWithFallback('music', 'Âm nhạc');
      case 'theatersandart':
        return transWithFallback('theatersandart', 'Sân khấu & Nghệ thuật');
      case 'sport':
        return transWithFallback('sport', 'Thể thao');
      default: 
        return transWithFallback('other', 'Khác');
    }
  }

  return (
    <div className="filter-event-management flex items-center gap-2 bg-white border rounded-lg px-2 ml-4 py-4 shadow-sm text-sm">
      {/* Filter - Loại sự kiện */}
      <div className="filter-type-btn flex items-center gap-1 pr-2">
        <span className="text-black font-semibold mr-1">{transWithFallback('eventCategory', 'Thể loại')}</span>

        <select value={categoryFilter} className="border px-2 py-1 rounded-md"
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          <option value="">{transWithFallback('all', 'Tất cả')}</option>
          {categories.map(cate => (
            <option key={cate.id} value={cate.name}>
              {standardCateogry(cate.name)}
            </option>
          ))}
        </select>
      </div>

      {/* Filter - Quản trị viên */}
<div className="filter-admin-btn flex items-center gap-1 border-l pl-4 pr-2">
  <span className="text-black font-semibold mr-1">
    {transWithFallback('admin', 'Quản trị viên')}
  </span>
  <select
    value={adminFilter}
    className="border px-2 py-1 rounded-md"
    onChange={(e) => onAdminChange(e.target.value)}
  >
    <option value="">{transWithFallback('all', 'Tất cả')}</option>
    {admins.map((admin) => (
      <option key={admin} value={admin}>
        {admin}
      </option>
    ))}
  </select>
</div>

      {/* Filter - Ngày tạo */}
      <div className="filter-created-btn relative border-l pl-4 pr-2">
        <div className="flex items-center gap-1 cursor-pointer"
          onClick={() => setShowDateFilter(!showDateFilter)}
        >
          <span className="text-black font-semibold">{transWithFallback('createdDate', 'Ngày tạo')}</span>
          <ChevronDown size={16} />
        </div>

        {showDateFilter && (
          <div className="absolute left-0 mt-2 bg-white shadow-lg rounded-md p-4 flex flex-col gap-3 z-10 border w-60">
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