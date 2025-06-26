'use client';

import { SortConfig } from "@/types/models/admin/eventManagement.interface";

export function sortEvents<T>(data: T[], sortConfig: SortConfig<T> | null): T[] {
  if (!sortConfig) return data;

  const { key, direction } = sortConfig;

  return [...data].sort((a, b) => {
    const aValue = a[key];
    const bValue = b[key];

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
