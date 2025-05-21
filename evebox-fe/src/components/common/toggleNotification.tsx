'use client';

/* Package System */
import { useState } from "react";
import { Bell } from "lucide-react";
import { useTranslations } from "next-intl";

/* Package Application */

export default function ToggleNotification() {
  const trans = useTranslations('common');
  const [isOn, setIsOn] = useState(false);

  return (
    <div className="notify-btn flex flex-col items-center justify-center text-center">
      <h3 className="text-lg font-semibold mb-3">{trans('receiveNoti') ?? 'Nhận thông báo từ EveBox'}</h3>

      <button
        onClick={() => setIsOn(!isOn)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-black rounded-full shadow-sm transition-all"
      >
        <Bell
          size={18}
          className={isOn ? "fill-black text-black" : "text-black"}
        />
        <span className="text-sm font-medium">
          {isOn ? (trans('subscribed') ?? "Đã đăng ký") : (trans('notSubscribed') ?? "Chưa đăng ký")}
        </span>
      </button>

      <p className="text-sm mt-2 text-white-600">
        {isOn
          ? (trans('youWillReceiveNoti') ?? "Bạn sẽ nhận được thông báo từ EveBox!")
          : (trans('youNotReceiveNoti') ?? "Bạn hiện chưa nhận được thông báo từ EveBox!")}
      </p>
    </div>
  );
}