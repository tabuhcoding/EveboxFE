'use client';

/* Package System */
import { useEffect, useState } from 'react';
import { useTranslations } from "next-intl";
import Link from 'next/link';

/* Package Application */
import { receiveTicket } from '@/services/booking.service';

export default function ReceiveTicket({ sendKey }: { sendKey?: string }) {
  const [status, setStatus] = useState<'loading' | 'success' | 'fail'>('loading');

  const t = useTranslations('common');
  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    if (!msg || msg.startsWith('common.')) return fallback;
    return msg;
  };

  useEffect(() => {
    const handleReceiveTicket = async () => {
      try {
        setStatus('loading');
        const res = await receiveTicket(sendKey || "");

        if (res?.statusCode !== 200) {
          setStatus('fail');
        }
        else if (!res?.data) {
          setStatus('fail');
        } else {
          setStatus('success');
        }
      } catch (error) {
        console.error('Error during fetch:', error);
        setStatus('fail');
      }
    };

    if (sendKey && sendKey.trim() !== '') {
      handleReceiveTicket();
    } else {
      setStatus('fail');
    }
  }, [sendKey]);

  const isSuccess = status === 'success';
  const isLoading = status === 'loading';
  const isFail = status === 'fail';

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 p-6 min-h-[60vh]">
      <div className="text-center w-full max-w-2xl flex flex-col items-center mb-4">
        <div className={`text-6xl pb-2 ${isSuccess ? 'text-green-500 animate-bounce' : isLoading ? 'text-blue-500' : 'text-red-500'}`}>
          {isSuccess ? '🎉' : isLoading ? '⏳' : '😞'}
        </div>

        <h1 className={`text-3xl font-bold pb-2 ${isSuccess ? 'text-green-600' : isLoading ? 'text-blue-600' : 'text-red-600'}`}>
          {isSuccess
            ? transWithFallback('receiveSuccess', 'Nhận vé thành công!')
            : isLoading
              ? transWithFallback('receiveProcessing', 'Hệ thống đang xử lý...')
              : transWithFallback('failedToReceive', 'Nhận vé thất bại!')}
        </h1>

        <div className="bg-blue-100 text-sky-900 p-4 rounded-lg shadow-md w-full mb-3 text-center mt-4">
          {isSuccess && (
            <>
              <span className="font-semibold">
                {transWithFallback('orgMessage', 'Lời nhắn của BTC')}:
              </span>{' '}
              {transWithFallback(
                'mailNotice',
                'Vé sẽ được gửi về email trong vòng 15 phút. Vui lòng kiểm tra email để biết thêm chi tiết.'
              )}
              <br />
              <span className="font-medium">
                {transWithFallback('youCanCheckTicket', 'Bạn có thể kiểm tra vé trong mục')}{' '}
                <Link
                  href="/my-ticket"
                  className="font-bold rounded px-2 py-1 transition-colors hover:bg-[#0C4762] hover:text-blue-100"
                >
                  {transWithFallback('myTicket', 'Vé của tôi')}
                </Link>
              </span>
            </>
          )}

          {isFail && (
            <span className="font-medium">
              {transWithFallback('giftReceiveExpired', 'Rất tiếc, thời gian nhận vé từ người tặng đã kết thúc. Vui lòng liên hệ ban tổ chức để được hỗ trợ.')}
            </span>
          )}

          {isLoading && (
            <span>
              {transWithFallback(
                'receivingProcessingNotice',
                'Hệ thống đang xử lý yêu cầu của bạn, vui lòng đợi trong giây lát...'
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
