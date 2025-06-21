'use client'

import { Icon } from "@iconify/react";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from 'next-intl';

interface TimeOutDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function TimeOutDialog({ open, onClose }: TimeOutDialogProps) {
  const t = useTranslations('common');

  const router = useRouter();
  const pathname = usePathname();

  const match = pathname.match(/\/event\/(\d+)\b/);
  const eventId = match ? match[1] : null;

  const handleClick = () => {
    if (eventId) {
      router.push(`/event/${eventId}`);
    } else {
      onClose();
    }
  }

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    if (!msg || msg.startsWith('common.')) return fallback;
    return msg;
  };

  return (
    <Dialog className="time-out-dialog" open={open} onClose={onClose}>
      <div className="text-white dialog-header px-6 py-4 justify-center items-center flex relative" style={{ background: '#0C4762' }}>
        <DialogTitle className="!m-0 !p-0 text-lg text-center font-bold">{transWithFallback('timeOutTicketTitle', 'Hết thời gian giữ vé')}</DialogTitle>
      </div>

      <DialogContent className="p-6 flex flex-col justify-center items-center">
        <Icon icon="twemoji:bell" width="50" height="50" />
        <p className="text-center">{transWithFallback('timeOutTicket', 'Đã hết thời gian giữ vé!')}</p>
        <p className="text-center">{transWithFallback('bookNewTicketNoti', 'Bạn hãy vui lòng đặt vé mới')}</p>
        <button onClick={handleClick} className="bg-[#0C4762] hover:bg-[#1d3945] text-white font-bold py-2 px-4 rounded mt-4">
          {transWithFallback('bookNewTicket', 'Đặt vé mới')}
        </button>
      </DialogContent>
    </Dialog>
  );
}