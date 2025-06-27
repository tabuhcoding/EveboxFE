'use client';

import { SortConfig } from "@/types/models/admin/showingManagement.interface";

export function sortShowings<T>(data: T[], sortConfig: SortConfig<T> | null): T[] {
  if (!sortConfig) return data;

  const { key, direction } = sortConfig;

  return [...data].sort((a, b) => {
    const aValue = a[key];
    const bValue = b[key];

    // Nếu là eventTitle
    if (
      key === "eventTitle" &&
      typeof aValue === "object" &&
      typeof bValue === "object" &&
      aValue !== null &&
      bValue !== null &&
      "title" in aValue &&
      "title" in bValue
    ) {
      return direction === "asc"
        ? (aValue.title as string).localeCompare(bValue.title as string)
        : (bValue.title as string).localeCompare(aValue.title as string);
    }

    // Nếu là mảng -> so sánh độ dài
    if (Array.isArray(aValue) && Array.isArray(bValue)) {
      return direction === 'asc'
        ? aValue.length - bValue.length
        : bValue.length - aValue.length;
    }

    // Nếu là kiểu ngày (ISO string)
    if (
      typeof aValue === 'string' &&
      typeof bValue === 'string' &&
      !isNaN(Date.parse(aValue)) &&
      !isNaN(Date.parse(bValue))
    ) {
      const aDate = new Date(aValue).getTime();
      const bDate = new Date(bValue).getTime();
      return direction === 'asc' ? aDate - bDate : bDate - aDate;
    }

    // Nếu là string thường
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return direction === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    // Nếu là number
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return direction === 'asc' ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });
}
