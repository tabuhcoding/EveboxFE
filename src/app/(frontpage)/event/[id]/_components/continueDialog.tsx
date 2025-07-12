'use client'

import { Icon } from "@iconify/react";
import { Dialog, DialogContent, DialogTitle, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface ContinueDialogProps {
  message: string;
  onClose: () => void;
  open: boolean;
  href: string;
}

export default function ContinueDialog({ message, onClose, open, href }: ContinueDialogProps) {
  const t = useTranslations("common");
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    if (!msg || msg.startsWith('common.')) return fallback;
    return msg;
  };

  const handleContinueClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      router.push(href);
    }, 100);
  };

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
        <p className="text-center">{message}</p>
        <div className="flex flex-col gap-4 w-full max-w-xs mt-4">
          <button
            onClick={handleContinueClick} disabled={isLoading}
            className="flex-1 bg-[#0C4762] hover:bg-[#1d3945] text-white font-bold py-2 px-4 rounded transition-colors duration-200 flex items-center justify-center gap-1"
          >
            {isLoading ? (
              <CircularProgress size={16} />
            ) : (
              transWithFallback('continueBookTicket', 'Tiếp tục đặt vé')
            )}
          </button>
          <button
            className="flex-1 border-2 border-gray-500 text-gray-500 font-bold py-2 px-4 rounded bg-white hover:!bg-[#0C4762] hover:text-white transition-all duration-200"
            onClick={onClose}
          >
            {transWithFallback('cancel', 'Hủy')}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}