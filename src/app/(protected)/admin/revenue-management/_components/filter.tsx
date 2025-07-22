'use client';

/* Package System */
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Search } from "lucide-react";
import { CircularProgress } from "@mui/material";

/* Package Application */
import { FilterProps } from "@/types/models/admin/revenueManagement.interface";

export default function Filter({ onFilterChange, isLoading }: FilterProps) {
  const t = useTranslations("common");

  const [searchQuery, setSearchQuery] = useState("")
  const [dateRange, setDateRange] = useState({
    fromDate: "",
    toDate: "",
  })

  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    setIsSearching(true);

    try {
      await onFilterChange({
        search: searchQuery || undefined,
        fromDate: undefined,
        toDate: undefined,
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleConfirm = () => {
    onFilterChange({
      fromDate: dateRange.fromDate || undefined,
      toDate: dateRange.toDate || undefined,
      search: searchQuery || undefined,
    });
  };

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    if (!msg || msg.startsWith('common.')) return fallback;
    return msg;
  }

  return (
    <div className="w-full p-4 mt-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80 lg:w-96">
          <input
            type="text"
            placeholder={transWithFallback('searchByEventOrOrg', 'Tìm kiếm theo email nhà tổ chức')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-4 pr-12 py-2 h-11 bg-white border border-gray-200 rounded-md w-full outline-none"
          />
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="absolute right-0 top-0 h-11 w-12 bg-teal-400 hover:bg-teal-500 rounded-r-md flex items-center justify-center"
          >
            {isSearching ? (
              <CircularProgress size={18} sx={{ color: "white" }} />
            ) : (
              <Search className="h-5 w-5 text-white" />
            )}
          </button>
        </div>

        {/* Date Range & Confirm */}
        <div className="flex gap-4 items-end">
          <div className="flex border border-gray-300 rounded-md bg-white">
            <div className="flex items-center px-4 py-2">
              <span className="text-sm text-gray-600">{transWithFallback('fromDate', 'Từ ngày')}:</span>
            </div>
            <input
              type="date"
              value={dateRange.fromDate}
              onChange={(e) => {
                const newFromDate = e.target.value;
                setDateRange((prev) => ({
                  ...prev,
                  fromDate: newFromDate,
                  toDate:
                    prev.toDate && new Date(newFromDate) > new Date(prev.toDate)
                      ? ""
                      : prev.toDate,
                }));
              }}
              className="border-0 outline-none px-4 py-2"
            />
            <div className="flex items-center px-4 py-2 ">
              <span className="text-sm text-gray-600">{transWithFallback('toDate', 'Đến ngày')}:</span>
            </div>
            <input
              type="date"
              value={dateRange.toDate}
              min={dateRange.fromDate}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, toDate: e.target.value }))
              }
              className="border-0 outline-none px-2 py-2 rounded-r-md"
            />
          </div>

          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="bg-teal-400 hover:bg-teal-500 text-white px-6 py-2 rounded-md flex items-center justify-center gap-2"
          >
            {isLoading && <CircularProgress size={18} color="inherit" />}
            {transWithFallback('confirm', 'Xác nhận')}
          </button>
        </div>
      </div>
    </div>
  );
}
