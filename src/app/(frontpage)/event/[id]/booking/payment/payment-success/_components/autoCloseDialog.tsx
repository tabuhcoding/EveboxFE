'use client';

/* Package System */
import { Icon } from "@iconify/react";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

/* Package Application */
import SupportInfo from "./supportInfo";

interface AutoCloseDialogProps {
  message: string;
  open: boolean;
  seconds?: number;
  onClose?: () => void;
}

export default function AutoCloseDialog({
  message,
  open,
  seconds = 5,
  onClose,
}: AutoCloseDialogProps) {
  const t = useTranslations("common");
  const router = useRouter();
  const [count, setCount] = useState(seconds);

  useEffect(() => {
    if (!open) return;
    setCount(seconds);
    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          router.push('/ticket');
          message = "";
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [open, router, seconds]);

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    if (!msg || msg.startsWith('common.')) return fallback;
    return msg;
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <div className="text-white dialog-header px-6 py-4 justify-center items-center flex relative" style={{ background: '#0C4762' }}>
        <DialogTitle className="!m-0 !p-0 text-lg text-center font-bold">{transWithFallback('notify', 'Thông báo')}</DialogTitle>
        <button onClick={onClose} className="absolute right-2 top-2 px-1 py-1 close-btn">
          <Icon icon="ic:baseline-close" width="20" height="20" />
        </button>
      </div>

      <DialogContent className="p-6 flex flex-col justify-center items-center">
        <Icon icon="material-symbols:warning" width="50" height="50" color="#f59e0b" />
        <p className="text-center mb-3">
          {message}<br />
          <span className="font-bold text-base text-[#0C4762]">
            {transWithFallback('redirectToMyTicket', 'Sẽ chuyển về trang Vé của tôi trong')} {count} {transWithFallback('seconds', 'giây')}
          </span>
        </p>
        <p className="mt-4 text-gray-600 text-base">
          {transWithFallback('supportLongWait', 'Nếu chờ quá lâu, vui lòng liên hệ hỗ trợ để được giải quyết nhanh nhất:')}
        </p>
        <SupportInfo />
      </DialogContent>
    </Dialog>
  );
}