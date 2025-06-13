'use client'

/* Package System */
import { Icon } from "@iconify/react";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

/* Package Application */

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  id?: number;
  showingId?: string;
  seatMapId?: number;
}

export default function ConfirmDialog({ open, onClose, id, showingId, seatMapId }: ConfirmDialogProps) {
  const router = useRouter();

  const t = useTranslations('common');

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    if (!msg || msg.startsWith('common.')) return fallback;
    return msg;
  };

  const handleCancel = () => {
    onClose();
    router.push(`/event/${id}/booking/select-ticket?showingId=${showingId}&eventId=${id}&seatMapId=${seatMapId}`);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <div className="text-white dialog-header px-6 py-4 justify-center items-center flex relative" style={{ background: '#0C4762' }}>
        <DialogTitle className="!m-0 !p-0 text-lg text-center font-bold">{transWithFallback('cancelOrder', 'Hủy đơn hàng')}</DialogTitle>
        <button onClick={onClose} className="absolute right-2 top-2 px-1 py-1 close-btn">
          <Icon icon="ic:baseline-close" width="20" height="20" />
        </button>
      </div>

      <DialogContent className="p-6 flex flex-col justify-center items-center">
        <Icon icon="material-symbols:warning" width="50" height="50" color="#f59e0b" />
        <p className="text-center">{transWithFallback('losePosition', 'Bạn sẽ mất vị trí mình đã lựa chọn.')} <br></br>{transWithFallback('orderAffected', 'Đơn hàng đang trong quá trinh thanh toán cũng sẽ bị ảnh hưởng.')} </p>
        <p className="text-center">{transWithFallback('continue?', 'Bạn có muốn tiếp tục?')}</p>
        <div className="flex gap-4 mt-4">
          <button
            onClick={handleCancel}
            className="border-2 border-[#0C4762] text-[#0C4762] font-bold py-2 px-4 rounded bg-white hover:bg-[#0C4762] hover:text-white transition-all"
          >
            {transWithFallback('cancelOrder', 'Hủy đơn hàng')}
          </button>
          <button
            onClick={onClose}
            className="bg-[#0C4762] hover:bg-[#1d3945] text-white font-bold py-2 px-4 rounded transition-all"
          >
            {transWithFallback('stay', 'Ở lại')}
          </button>
        </div>

      </DialogContent>
    </Dialog>
  );
}