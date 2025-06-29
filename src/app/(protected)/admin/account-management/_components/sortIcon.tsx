"use client";

import React from 'react';
import { SortIconProps } from '@/types/models/admin/accountManagement.interface';

export default function SortIcon<T,>({ field, sortConfig }: SortIconProps<T>) {
  if (sortConfig?.key !== field) return <span className="text-gray-300">⇅</span>; // Icon mặc định
  return (
    <span className="ml-1 text-xs">
      {sortConfig.direction === 'asc' ? '▲' : '▼'}
    </span>
  );
};  