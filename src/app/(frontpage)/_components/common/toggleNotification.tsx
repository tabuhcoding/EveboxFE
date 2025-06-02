"use client";

import { Bell } from "lucide-react";
import { useTranslations } from 'next-intl';
import { useState } from "react";


export default function ToggleNotification() {
  const [isOn, setIsOn] = useState(false);
  const t = useTranslations('common');

  const transWithFallback = (key: string, fallback: string) => {
      const msg = t(key);
      if (!msg || msg.startsWith('common.')) return fallback;
      return msg;
  };

  return (
    <div className="notify-btn flex flex-col items-center justify-center text-center">
      <h3 className="text-lg font-semibold mb-3">{transWithFallback('receiveMessage', 'Nhận thông báo từ EveBox')}</h3>

      <button
        onClick={() => setIsOn(!isOn)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-black rounded-full shadow-sm transition-all"
      >
        <Bell
          size={18}
          className={isOn ? "fill-black text-black" : "text-black"}
        />
        <span className="text-sm font-medium">
          {isOn ? transWithFallback('subscribed', 'Đã đăng ký') : transWithFallback('unsubscribed', 'Chưa đăng ký')}
        </span>
      </button>

      <p className="text-sm mt-2 text-white-600">
        {isOn
          ? transWithFallback('receiveNoti', 'Bạn sẽ nhận được thông báo từ EveBox!')
          : transWithFallback('unreceiveNoti', 'Bạn hiện chưa nhận được thông báo từ EveBox!')}
      </p>
    </div>
  );
}
