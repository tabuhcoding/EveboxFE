'use client'

import { Icon } from "@iconify/react";
import { CircularProgress, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface AlertDialogProps {
  message: string;
  onClose: () => void;
  open: boolean;
  href?: string;
}

export default function AlertDialog({ message, onClose, open, href }: AlertDialogProps) {
  const t = useTranslations("common");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    if (!msg || msg.startsWith('common.')) return fallback;
    return msg;
  };

  const handleRouterPush = () => {
    setIsLoading(true);

    if (href) {
      router.push(href);
    }
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <div className="text-white dialog-header px-6 py-4 justify-center items-center flex relative" style={{ background: '#0C4762' }}>
        <DialogTitle className="!m-0 !p-0 text-lg text-center font-bold">{transWithFallback('notify', 'Thông báo')}</DialogTitle>
        {!href && (
          <button onClick={onClose} className="absolute right-2 top-2 px-1 py-1 close-btn">
            <Icon icon="ic:baseline-close" width="20" height="20" />
          </button>
        )}
      </div>

      <DialogContent className="p-6 flex flex-col justify-center items-center">
        <Icon icon="material-symbols:warning" width="50" height="50" color="#f59e0b" />
        <p className="text-center mt-2">{message}</p>
        {href && (
          <button onClick={handleRouterPush} className="bg-[#0C4762] hover:bg-[#1d3945] text-white font-bold py-2 px-4 rounded mt-3 mb-4 flex items-center justify-center gap-1">
            {isLoading ? (
              <>
                <CircularProgress size={16} />
                {t('loadingBtn') || "Đang xử lý..."}
              </>
            ) : (
              transWithFallback('goToLogin', 'Đến trang đăng nhập')
            )}
          </button>
        )}
      </DialogContent>
    </Dialog>
  );
}