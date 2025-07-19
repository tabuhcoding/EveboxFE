'use client';

/* Package System */
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { RotateCcw } from "lucide-react";

/* Package Application */
import { FilterProps, OptionType } from "@/types/models/admin/eventSpecialManagement.interface";
import { Category } from "@/types/models/admin/eventManagement.interface";
import { getAllCategories } from "@/services/event.service";

export default function FilterBar({
  categoryFilter, onCategoryChange,
  onReset
}: FilterProps) {
  //Call api để lấy ra các categories
  const t = useTranslations('common');

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    if (!msg || msg.startsWith('common.')) return fallback;
    return msg;
  };

  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      const data = await getAllCategories();
      setCategories(data);
    };

    loadCategories();
  }, []);

  const fullOptions: OptionType[] = [
    { label: "Chỉ trên EveBox", value: "__onlyOnEve" },
    { label: "Sự kiện đặc biệt", value: "__special" },
    ...categories.map(cat => ({
      label: transWithFallback(cat.name, cat.name),
      value: cat.id,
    }))
  ];

  return (
    <div className="filter-event-management flex items-center gap-2 bg-white border rounded-lg px-2 py-4 shadow-sm text-sm">
      {/* Filter - Loại sự kiện */}
      <div className="filter-type-btn flex items-center gap-1 pr-2">
        <span className="text-black font-semibold mr-1">Loại sự kiện</span>

        <select value={categoryFilter} className="border px-2 py-1 rounded-md"
          onChange={(e) => {
            const rawValue = e.target.value;

            if (rawValue === "") {
              onCategoryChange("");
            } else if (rawValue === "__onlyOnEve" || rawValue === "__special") {
              onCategoryChange(rawValue as "__onlyOnEve" | "__special");
            } else {
              onCategoryChange(Number(rawValue)); // map string to number
            }
          }}
        >
          <option value="">Tất cả</option>
          {fullOptions.map(opt => (
            <option
              key={opt.value + opt.label}
              value={opt.value}
              disabled={opt.isSeparator}
            >
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Reset Filter */}
      <div onClick={onReset} className="reset-filter-btn flex items-center gap-1 border-l pl-4 pr-2 text-red-500 cursor-pointer hover:underline ml-auto">
        <RotateCcw size={16} />
        <span>Reset Filter</span>
      </div>
    </div>
  )
}