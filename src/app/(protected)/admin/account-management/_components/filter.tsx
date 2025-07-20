"use client";

/* Package System */
import { ChevronDown, RotateCcw } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";

/* Package Application */
import { FilterProps, UserRole } from "@/types/models/admin/accountManagement.interface";

export default function FilterBar({
  roleFilter, onRoleChange,
  dateFrom, dateTo,
  onDateFromChange, onDateToChange,
  statusFilter, onStatusChange,
  onReset
}: FilterProps) {
  const t = useTranslations('common');

  const roles = Object.values(UserRole).map(role => role);

  const [showDateFilter, setShowDateFilter] = useState(false);

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    if (!msg || msg.startsWith('common.')) return fallback;
    return msg;
  };

  return (
    <div className="filter-account-management flex items-center gap-4 bg-white border rounded-lg px-4 py-4 shadow-sm text-sm">
      {/* Filter - Vai trò */}
      <div className="filter-role flex items-center gap-1 pr-2">
        <span className="text-black font-semibold mr-1">{transWithFallback('role', 'Vai trò')}</span>
        
        <select value={roleFilter} className="border px-2 py-1 rounded-md"
          onChange={(e) => onRoleChange(e.target.value)}
        >
          <option value="">{transWithFallback('all', 'Tất cả')}</option>
          {roles.map(role => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>

      {/* Filter - Trạng thái */}
      <div className="filter-status flex items-center gap-1 pr-2 border-l pl-4">
        <span className="text-black font-semibold mr-1">{transWithFallback("status", "Trạng thái")}</span>

        <select value={statusFilter} className="border px-2 py-1 rounded-md"
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <option value="">{transWithFallback('all', 'Tất cả')}</option>
          <option value="ACTIVE">{transWithFallback('active', 'Đang hoạt động')}</option>
          <option value="BLOCKED">{transWithFallback('blocked', 'Bị khóa')}</option>
        </select>
      </div>

      {/* Filter - Ngày tạo */}
      <div className="filter-created relative border-l pl-4 pr-2">
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
      <div onClick={onReset} title={`${transWithFallback('resetFilter', 'Thiết lập lại bộ lọc')}`} className="reset-filter-btn flex items-center gap-1 border-l pl-4 pr-2 text-red-500 cursor-pointer hover:underline ml-auto">
        <RotateCcw size={16} />
      </div>
    </div>
  )
}