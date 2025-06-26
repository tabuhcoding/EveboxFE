'use client'

import React from 'react';
import { useTranslations } from 'next-intl';

export default function GlobalLoading({ visible }: { visible: boolean }) {
  if (!visible) return null;

  const t = useTranslations('common');

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    return !msg || msg.startsWith('common.') ? fallback : msg;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white px-6 py-4 rounded-xl shadow-lg text-center text-sm font-medium">
        <div className="animate-pulse">⏳ {transWithFallback('loadingRequest', 'Đang xử lý yêu cầu...')}</div>
      </div>
    </div>
  );
}
