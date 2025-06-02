'use client'

import { Icon } from "@iconify/react";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { useTranslations } from "next-intl";

interface AlertDialogProps {
    message: string;
    onClose: () => void;
    open: boolean;
}

export default function AlertDialog({ message, onClose, open }: AlertDialogProps) {
    const t = useTranslations("common");
    return (
        <Dialog open={open} onClose={onClose}>
            <div className="text-white dialog-header px-6 py-4 justify-center items-center flex relative" style={{ background: '#0C4762' }}>
                <DialogTitle className="!m-0 !p-0 text-lg text-center font-bold">{t("notify") ?? "Thông báo"}</DialogTitle>
                <button onClick={onClose} className="absolute right-2 top-2 px-1 py-1 close-btn">
                    <Icon icon="ic:baseline-close" width="20" height="20" />
                </button>
            </div>

            <DialogContent className="p-6 flex flex-col justify-center items-center">
                <Icon icon="material-symbols:warning" width="50" height="50"  color="#f59e0b"  />
                <p className="text-center">{message}</p>
            </DialogContent>
        </Dialog>
    );
}