'use client';

/* Package System */
import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { useTranslations } from 'next-intl';

/* Package Application */
import { useAuth } from '@/contexts/auth.context';
import { GiftTicketModalProps } from '@/types/models/ticket/ticketInfoById';

type ReceiverInfo = {
  name: string;
  email: string;
  phone: string;
}

export default function GiftTicketModal({ isOpen, onClose, ticketId }: GiftTicketModalProps) {
  const { session } = useAuth();
  const accessToken = session?.user?.accessToken;
  const t = useTranslations('common');

  const [giftEmail, setGiftEmail] = useState('');
  const [giftLoading, setGiftLoading] = useState(false);
  const [checkLoading, setCheckLoading] = useState(false);
  const [receiver, setReceiver] = useState<ReceiverInfo | null>(null);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);
  const [userExists, setUserExists] = useState<boolean | null>(null);
  const [hasGiftedSuccess, setHasGiftedSuccess] = useState(false);

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
      setReceiver(null);
      setCheckLoading(false);
    }
  }, [isOpen]);

  const handleCheckUser = async () => {
    if (!isValidEmail(giftEmail)) {
      setAlertMsg(transWithFallback('invalidEmail', 'Email không hợp lệ'));
      setReceiver(null);
      return;
    }

    setCheckLoading(true);
    setAlertMsg(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/email/${encodeURIComponent(giftEmail)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await res.json();

      if (res.ok) {
        setReceiver({
          name: result.data.name,
          email: result.data.email,
          phone: result.data.phone,
        });
        setUserExists(true);
        setAlertMsg(null);
      } else {
        setReceiver(null);
        setUserExists(false);
        setAlertMsg(null);
      }
    } catch {
      setAlertMsg(transWithFallback('checkFailed', 'Kiểm tra thất bại!'));
      setReceiver(null);
      setUserExists(null);
    } finally {
      setCheckLoading(false);
    }
  };

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
        setHasGiftedSuccess(true);
        setAlertMsg(null);
        setGiftEmail('');
        setReceiver(null);
        setCheckLoading(false);
        setUserExists(null);
        setTimeout(() => {
          handleClose();
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

  const handleClose = () => {
    setAlertMsg(null);
    setGiftLoading(false);
    setReceiver(null);
    setCheckLoading(false);
    setUserExists(null);
    setHasGiftedSuccess(false);
    onClose();
  }

  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth="xs" fullWidth>
      <div
        className="text-white dialog-header px-6 py-4 justify-center items-center flex relative"
        style={{ background: '#0C4762' }}
      >
        <DialogTitle className="!m-0 !p-0 text-lg text-center font-bold">
          {transWithFallback('giftTicketEmail', 'Tặng vé qua email')}
        </DialogTitle>
        <button
          onClick={handleClose}
          className="absolute right-2 top-2 px-1 py-1 close-btn"
          aria-label="Close modal"
          disabled={giftLoading || checkLoading}
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
          onChange={(e) => {
            const newEmail = e.target.value;
            setGiftEmail(newEmail);
            setAlertMsg(null);
            setGiftLoading(false);
            setReceiver(null);
            setCheckLoading(false);
            setUserExists(null);
          }}
          placeholder="example@email.com"
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#51DACF] ${alertMsg && !giftLoading && !isValidEmail(giftEmail) ? 'border-red-600' : ''
            }`}
          disabled={giftLoading || checkLoading}
        />
        <button
          onClick={handleCheckUser}
          disabled={checkLoading || !giftEmail}
          className="mt-3 px-4 py-2 bg-[#51DACF] text-[#0C4762] font-bold rounded hover:bg-[#3ec8bd] disabled:opacity-50"
        >
          {checkLoading ? transWithFallback('checking', 'Đang kiểm tra...') : transWithFallback('checkUser', 'Kiểm tra người nhận')}
        </button>
        {receiver && (
          <div className="mt-4 bg-gray-100 text-sm text-black p-4 rounded-lg">
            <p><strong>{transWithFallback('name', 'Tên')}:</strong> {receiver.name}</p>
            <p><strong>{transWithFallback('email', 'Email')}:</strong> {receiver.email}</p>
            <p><strong>{transWithFallback('phone', 'SĐT')}:</strong> {receiver.phone}</p>
          </div>
        )}

        {hasGiftedSuccess && (
          <p className="mt-4 text-green-600 font-semibold">
            {transWithFallback('giftSuccess', 'Vé đã được gửi thành công!')}
          </p>
        )}

        {userExists === false && (
          <p className="mt-4 text-sm text-black">
            {transWithFallback('userNotFoundMsg', 'Hiện chưa có thông tin người dùng')} <strong>{giftEmail}</strong> {transWithFallback('userNotFoundConfirm', 'này trong hệ thống, bạn có đồng ý tiếp tục gửi vé?')}
          </p>
        )}

        {/* Buttons */}
        <div className="flex flex-col justify-center gap-4 mt-6 w-full mb-2">
          {(userExists !== null && giftEmail.trim() !== '') && (
            <>
              <button
                onClick={handleClose}
                disabled={giftLoading}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 w-full"
              >
                {transWithFallback('btnCancel', 'Hủy')}
              </button>
              <button
                disabled={giftLoading}
                onClick={handleSendGift}
                className="px-4 py-2 bg-[#51DACF] text-[#0C4762] font-bold rounded hover:bg-[#3ec8bd] disabled:opacity-50"
              >
                {giftLoading
                  ? transWithFallback('sending', 'Đang gửi...')
                  : userExists
                    ? transWithFallback('giftTicket', 'Gửi tặng')
                    : transWithFallback('sendAnyway', 'Tiếp tục gửi vé')}
              </button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
