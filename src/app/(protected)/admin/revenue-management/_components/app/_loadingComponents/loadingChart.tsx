'use client';

import { useEffect, useState } from "react";

interface LoadingProps {
  isLoading: boolean;
  height?: number | string;
  width?: number | string;
  className?: string;
}

export default function LoadingChartSkeleton({ isLoading, height = 350, width = '100%', className = '' }: LoadingProps) {
  const [showLoading, setShowLoading] = useState(false);

  // Thêm delay để tránh hiệu ứng "nhấp nháy" khi tải nhanh
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isLoading) {
      timer = setTimeout(() => setShowLoading(true), 200);
    } else {
      setShowLoading(false);
    }

    return () => clearTimeout(timer);
  }, [isLoading]);

  if (!showLoading) return null;

  return (
    <div 
      className={`relative overflow-hidden bg-gray-100 rounded-lg ${className}`}
      style={{ height, width }}
    >
      {/* Skeleton cho title */}
      <div className="h-6 w-1/3 mb-4 bg-gray-200 rounded animate-pulse"></div>
      
      {/* Skeleton cho chart area */}
      <div className="h-full w-full bg-gray-200 rounded animate-pulse"></div>
      
      {/* Hiệu ứng shimmer */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-gray-100 via-white to-gray-100 animate-shimmer"></div>
    </div>
  );
}