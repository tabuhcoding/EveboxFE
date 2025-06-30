"use client";

import React from 'react';
import 'tailwindcss/tailwind.css';

export default function AccountSkeletonLoading() {
  return (
    <div className="w-full animate-pulse">
      {/* Header skeleton */}
      <div className="h-8 w-64 bg-gray-200 rounded mb-1"></div>
      <div className="h-4 w-72 bg-gray-100 rounded mb-2"></div>
      <div className="border-t-2 border-gray-200 mt-2 mb-6"></div>

      {/* Search and filter bar skeleton */}
      <div className="flex justify-between items-center mt-6 mb-6">
        <div className="h-10 w-64 bg-gray-200 rounded"></div>
        <div className="flex space-x-2">
          <div className="h-10 w-32 bg-gray-200 rounded"></div>
          <div className="h-10 w-32 bg-gray-200 rounded"></div>
          <div className="h-10 w-32 bg-gray-200 rounded"></div>
          <div className="h-10 w-24 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Table skeleton */}
      <div className="overflow-x-auto rounded-xl shadow-md mt-6">
        <div className="min-w-full border border-gray-200">
          {/* Table header */}
          <div className="bg-gray-300 h-12 w-full flex">
            <div className="w-1/12 px-4 py-3"></div>
            <div className="w-2/12 px-4 py-3"></div>
            <div className="w-3/12 px-4 py-3"></div>
            <div className="w-2/12 px-4 py-3"></div>
            <div className="w-2/12 px-4 py-3"></div>
            <div className="w-2/12 px-4 py-3"></div>
          </div>

          {/* Table rows */}
          {[...Array(10)].map((_, index) => (
            <div key={index} className="border-t border-gray-200 h-14 w-full flex">
              <div className="w-1/12 px-4 py-3 flex items-center justify-center">
                <div className="h-4 w-4 bg-gray-200 rounded"></div>
              </div>
              <div className="w-2/12 px-4 py-3 flex items-center">
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
              </div>
              <div className="w-3/12 px-4 py-3 flex items-center">
                <div className="h-4 w-48 bg-gray-200 rounded"></div>
              </div>
              <div className="w-2/12 px-4 py-3 flex items-center">
                <div className="h-4 w-20 bg-gray-200 rounded"></div>
              </div>
              <div className="w-2/12 px-4 py-3 flex items-center justify-center">
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
              </div>
              <div className="w-2/12 px-4 py-3 flex items-center justify-center">
                <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination skeleton */}
      <div className="flex items-center justify-between mt-4 px-2">
        <div className="h-5 w-40 bg-gray-200 rounded"></div>
        <div className="flex items-center space-x-2">
          <div className="h-8 w-24 bg-gray-200 rounded-full"></div>
          <div className="h-8 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}