'use client'

/* Package System */
import { useTranslations } from "next-intl";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { Icon } from "@iconify/react";

/* Package Application */
import { ConfirmApprovalProps } from "@/types/models/admin/eventManagement.interface";

export default function ConfirmDeleteDialog({ open, onClose, onConfirm, isLoading }: ConfirmApprovalProps) {
  const t = useTranslations('common');

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    if (!msg || msg.startsWith('common.')) return fallback;
    return msg;
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <div className="text-white dialog-header px-6 py-4 justify-center items-center flex relative" style={{ background: '#0C4762' }}>
        <DialogTitle className="!m-0 !p-0 text-lg text-center font-bold">
          {transWithFallback('confirmDelete', 'Xác nhận xóa sự kiện')}
        </DialogTitle>
        <button onClick={onClose} className="absolute right-2 top-2 px-1 py-1 close-btn">
          <Icon icon="ic:baseline-close" width="20" height="20" />
        </button>
      </div>

      <DialogContent className="p-6 flex flex-col justify-center items-center">
        {isLoading ? (
          <div className="flex items-center">
            <Icon icon="eos-icons:loading" width="24" height="24" className="animate-spin mr-2" />
            <span className="text-gray-700">{transWithFallback('loading', 'Đang xử lý...')}</span>
          </div>
        ) : (
          <>
            <Icon icon="material-symbols:warning" width="50" height="50" color="#f59e0b" className="relative z-50" />

            <div className="content mx-4 mt-2 mb-4 text-center">
              <p>{transWithFallback('uSureWantTo', 'Bạn có chắc muốn')} <strong>&quot;{transWithFallback('permantlyDelete', 'Xóa vĩnh viễn')}&quot;</strong></p>
              <p>{transWithFallback('thisEvent?', ' sự kiện này không?')}</p>
            </div>

            <div className="flex gap-4 mt-4 mb-4">
              <button className="w-32 border-2 border-gray-500 text-gray-500 font-bold py-2 px-4 rounded bg-white hover:bg-gray-500 hover:text-white transition-all"
                onClick={onClose}>
                {transWithFallback('cancel', 'Hủy')}

              </button>

              <button className="w-32 border-2 border-[#0C4762] text-[#0C4762] font-bold py-2 px-4 rounded bg-white hover:bg-[#0C4762] hover:text-white transition-all"
                onClick={() => {
                  onConfirm();
                  onClose();
                }}>
                {transWithFallback('confirm', 'Xác nhận')}
              </button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog >
  );
}