"use client";

/* Package System */
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';

interface SessionExpiredDialogProps {
    open: boolean;
    onLogin: () => void;
}

export const SessionExpiredDialog = ({ open, onLogin }: SessionExpiredDialogProps) => {
    const t = useTranslations('common');

    const transWithFallback = (key: string, fallback: string) => {
        const msg = t(key);
        if (!msg || msg.startsWith('common.')) return fallback;
        return msg;
    };

    return (
        <Dialog
            open={open}
            disableEscapeKeyDown
            onClose={(event, reason) => {
                if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
                    return;
                }
            }}
            PaperProps={{
                style: {
                    borderRadius: '16px',
                    padding: '16px',
                    minWidth: '420px',
                    maxWidth: '500px'
                }
            }}
        >
            <DialogTitle>
                <div className="flex items-center justify-center flex-col text-center">
                    <Icon
                        icon="material-symbols:lock-clock"
                        width="48px"
                        color="#f59e0b"
                        className="mb-2"
                    />
                    <h3 className="text-lg font-semibold text-gray-800 m-0">
                        {transWithFallback('sessionExpiredTitle', 'Phiên đăng nhập đã hết hạn')}
                    </h3>
                </div>
            </DialogTitle>

            <DialogContent>
                <div className="text-center py-4">
                    <p className="text-gray-600 mb-4">
                        {transWithFallback('sessionExpiredMessage', 'Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại để tiếp tục sử dụng.')}
                    </p>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <div className="flex items-center justify-center">
                            <Icon
                                icon="material-symbols:info"
                                width="20px"
                                color="#f59e0b"
                                className="mr-2"
                            />
                            <span className="text-sm text-amber-700">
                                {transWithFallback('sessionExpiredNote', 'Dữ liệu đã nhập sẽ được bảo toàn sau khi đăng nhập')}
                            </span>
                        </div>
                    </div>
                </div>
            </DialogContent>

            <DialogActions className="justify-center pb-4">
                <Button
                    onClick={onLogin}
                    variant="contained"
                    size="large"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-2 rounded-lg"
                    startIcon={<Icon icon="material-symbols:login" width="20px" />}
                >
                    {transWithFallback('loginAgain', 'Đăng nhập lại')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
