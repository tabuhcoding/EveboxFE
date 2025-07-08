'use client'

/* Package System */
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { Icon } from "@iconify/react";
import { useTranslations } from 'next-intl';

/* Package Application */
import { ConfirmDialogProps } from "../../../../libs/interface/dialog.interface";

export default function ConfirmDeleteShowDialog({ open, onClose, onConfirm }: ConfirmDialogProps) {
    const t = useTranslations('common');

    const transWithFallback = (key: string, fallback: string) => {
        const msg = t(key);
        if (!msg || msg.startsWith('common.')) return fallback;
        return msg;
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <div className="text-white dialog-header px-6 py-4 justify-center items-center flex relative" style={{ background: '#0C4762' }}>
                <DialogTitle className="!m-0 !p-0 text-lg text-center font-bold">{transWithFallback('deleteShow', 'Xóa suất diễn')}</DialogTitle>
                <button onClick={onClose} className="absolute right-2 top-2 px-1 py-1 close-btn">
                    <Icon icon="ic:baseline-close" width="20" height="20" />
                </button>
            </div>

            <DialogContent className="p-6 flex flex-col justify-center items-center">
                <Icon icon="material-symbols:warning" width="50" height="50" color="#f59e0b" className="relative z-50" />

                <div className="content mx-4 mt-2 mb-4">
                    {transWithFallback('confirmDelShow', 'Bạn có muốn xoá suất diễn này?')}
                </div>

                <div className="flex gap-4 mt-4 mb-4">
                    <button
                        onClick={onClose}
                        className="w-32 border-2 border-gray-500 text-gray-500 font-bold py-2 px-4 rounded bg-white hover:bg-gray-500 hover:text-white transition-all"
                    >
                        {transWithFallback('btnCancel', 'Hủy')}
                    </button>

                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="w-32 border-2 border-[#0C4762] text-[#0C4762] font-bold py-2 px-4 rounded bg-white hover:bg-[#0C4762] hover:text-white transition-all"
                    >
                        OK
                    </button>
                </div>

            </DialogContent>
        </Dialog>
    );
}