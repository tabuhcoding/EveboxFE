'use client';

/* Package System */
import { Icon } from "@iconify/react";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { useTranslations } from 'next-intl';

/* Package Application */

interface UpdateConfirmModalProps {
  show: boolean;
  checkMessage: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function UpdateConfirmModal({ 
  show, 
  checkMessage, 
  onConfirm, 
  onCancel 
}: UpdateConfirmModalProps) {
  const t = useTranslations('common');

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    if (!msg || msg.startsWith('common.')) return fallback;
    return msg;
  };

  return (
    <Dialog open={show} onClose={onCancel}>
      <div className="text-white dialog-header px-6 py-4 justify-center items-center flex relative" style={{ background: '#0C4762' }}>
        <DialogTitle className="!m-0 !p-0 text-lg text-center font-bold">
          {transWithFallback('confirmUpdate', 'Xác nhận cập nhật')}
        </DialogTitle>
        <button onClick={onCancel} className="absolute right-2 top-2 px-1 py-1 close-btn">
          <Icon icon="ic:baseline-close" width="20" height="20" />
        </button>
      </div>

      <DialogContent className="p-6 flex flex-col justify-center items-center">
        <Icon icon="material-symbols:warning" width="50" height="50" color="#f59e0b" />
        <p className="text-center">
          {transWithFallback(
            'updateNeedReview', 
            'Thay đổi của bạn có thể cần duyệt lại, vì:'
          )} <br />
          <strong>{checkMessage}</strong>
        </p>
        <p className="text-center mt-2">
          {transWithFallback(
            'updateWillWaitApproval',
            'Nếu tiếp tục, sự kiện của bạn sẽ được cập nhật và cần đợi đến đợt duyệt tiếp theo.'
          )}
        </p>
        <div className="flex gap-4 mt-4">
          <button
            onClick={onCancel}
            className="border-2 border-[#0C4762] text-[#0C4762] font-bold py-2 px-4 rounded bg-white hover:!bg-[#0C4762] hover:text-white transition-all"
          >
            {transWithFallback('no', 'Không')}
          </button>
          <button
            onClick={onConfirm}
            className="bg-[#0C4762] hover:bg-[#1d3945] text-white font-bold py-2 px-4 rounded transition-all"
          >
            {transWithFallback('confirm', 'Xác nhận')}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}