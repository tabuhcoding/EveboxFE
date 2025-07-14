'use client';

/* Package System */
import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { useTranslations } from 'next-intl';

/* Package Application */
import { useAuth } from '@/contexts/auth.context';
import { GiftTicketModalProps } from '@/types/models/ticket/ticketInfoById';

export default function GiftTicketModal({ isOpen, onClose, ticketId }: GiftTicketModalProps) {
  const { session } = useAuth();
  const accessToken = session?.user?.accessToken;
  const [giftEmail, setGiftEmail] = useState('');
  const [giftLoading, setGiftLoading] = useState(false);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);
  const t = useTranslations('common');

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    if (!msg || msg.startsWith('common.')) return fallback;
    return msg;
  };

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  useEffect(() => {
    if (!isOpen) {
      setGiftEmail('');
      setAlertMsg(null);
      setGiftLoading(false);
    }
  }, [isOpen]);

  const handleSendGift = async () => {
    if (!isValidEmail(giftEmail)) {
      setAlertMsg(transWithFallback('invalidEmail', 'Email không hợp lệ'));
      return;
    }

    setGiftLoading(true);
    setAlertMsg(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/booking/give-ticket`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          orderId: ticketId,
          sendTo: giftEmail
        }),
      });

      if (res.ok) {
        setAlertMsg(transWithFallback('giftSuccess', '🎉 Tặng vé thành công!'));
        setGiftEmail('');
        setTimeout(() => {
          setAlertMsg(null);
          onClose();
        }, 1500);
      } else {
        const { message } = await res.json();
        setAlertMsg(`${transWithFallback("err", "Lỗi")}: ${message}`);
      }
    } catch {
      setAlertMsg(transWithFallback('giftFailed', 'Gửi tặng thất bại!'));
    } finally {
      setGiftLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="xs" fullWidth>
      <div
        className="text-white dialog-header px-6 py-4 justify-center items-center flex relative"
        style={{ background: '#0C4762' }}
      >
        <DialogTitle className="!m-0 !p-0 text-lg text-center font-bold">
          {transWithFallback('giftTicketEmail', 'Tặng vé qua email')}
        </DialogTitle>
        <button
          onClick={onClose}
          className="absolute right-2 top-2 px-1 py-1 close-btn"
          aria-label="Close modal"
          disabled={giftLoading}
        >
          <Icon icon="ic:baseline-close" width="20" height="20" />
        </button>
      </div>

      {/* Content */}
      <DialogContent className="p-6 flex flex-col">
        <p className="text-sm text-black font-semibold text-left mb-2">
          {transWithFallback("giftTicketFor", "Nhập email người nhận để tặng vé này")}
        </p>
        <input
          type="email"
          value={giftEmail}
          onChange={(e) => setGiftEmail(e.target.value)}
          placeholder="example@email.com"
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#51DACF] ${alertMsg && !giftLoading && !isValidEmail(giftEmail) ? 'border-red-600' : ''
            }`}
          disabled={giftLoading}
        />
        {alertMsg && (
          <p
            className={`mt-2 text-sm select-none ${alertMsg.includes('🎉') ? 'text-green-600' : 'text-red-600'
              }`}
            style={{ textAlign: 'left' }}
          >
            {alertMsg}
          </p>
        )}

        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-6 w-full max-w-xs mb-2 mx-auto">
          <button
            onClick={onClose}
            disabled={giftLoading}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            {transWithFallback('btnCancel', 'Hủy')}
          </button>
          <button
            disabled={giftLoading || !giftEmail}
            onClick={handleSendGift}
            className="px-4 py-2 bg-[#51DACF] text-[#0C4762] font-bold rounded hover:bg-[#3ec8bd] disabled:opacity-50"
          >
            {giftLoading ? transWithFallback('sending', 'Đang gửi...') : transWithFallback('sendGift', 'Gửi tặng')}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
