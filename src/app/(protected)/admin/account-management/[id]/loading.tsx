'use client';

import { useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";
import 'tailwindcss/tailwind.css';

export default function Loading() {
  const t = useTranslations('common');

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    if (!msg || msg.startsWith('common.')) return fallback;
    return msg;
  };

  return (
    <>
      <div className="flex items-center space-x-2">
        <ArrowLeft size={30} className="text-gray-300 cursor-not-allowed" />
        <h1 className="text-2xl font-bold text-[#0C4762] mb-1">{transWithFallback('detailInfo', 'Thông tin chi tiết')}</h1>
      </div>

      <div className="border-t-2 border-[#0C4762] mt-2"></div>

      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-12 mt-10 mb-10">
        {/* Avatar placeholder */}
        <div className="flex justify-center mb-8">
          <div className="relative w-24 h-24 rounded-full bg-gray-200 animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Form field placeholders */}
          {Array(6).fill(0).map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="h-5 bg-gray-200 rounded w-1/3 animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
            </div>
          ))}
        </div>

        {/* Save button placeholder */}
        <div className="mt-10 mb-4 text-center">
          <div className="inline-block bg-gray-200 h-10 w-60 rounded-md animate-pulse"></div>
        </div>
      </div>
    </>
  );
}