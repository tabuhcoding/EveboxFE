'use client';

/* Package System */
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

/* Package Application */
import { getUserOrderByOriginalId } from "@/services/payment.service";
import { OrderResponse } from "@/types/models/event/booking/payment.interface";
import { useAuth } from "@/contexts/auth.context";

import AutoCloseDialog from "./autoCloseDialog";
import OrderInfoTable from "./orderInfoTable";
import ShowingInfo from "./showingInfo";
import SupportInfo from "./supportInfo";
import TicketResponseInfo from "./ticketResponseInfo";

export default function PaymentSuccessPage({ orderCode, status }: { orderCode?: string, status?: string }) {
  const t = useTranslations('common');
  const { session } = useAuth();

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [orderResponseDetail, setOrderResponseDetail] = useState<OrderResponse | null>(null);

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    if (!msg || msg.startsWith('common.')) return fallback;
    return msg;
  };

  useEffect(() => {
    if (!orderCode || orderCode === "") {
      setAlertOpen(true);
      return;
    }

    if (status && status !== "PAID") {
      // setAlertMessage(transWithFallback('orderFailOrBankFail', 'Thanh toán không thành công hoặc bị gián đoạn từ phía ngân hàng'));
      setAlertMessage(transWithFallback('orderProcessingNotice', 'Thanh toán của bạn đang được xử lý. Vui lòng đợi xác nhận từ hệ thống hoặc liên hệ hỗ trợ nếu chờ lâu.'));
      setAlertOpen(true);
      return;
    }

    const fetchUserOrder = async () => {
      setIsLoading(true);
      try {
        const res = await getUserOrderByOriginalId(orderCode || "0", session?.user?.accessToken || "");

        if (res.statusCode === 200) {
          setOrderResponseDetail(res?.data);
        }
        else {
          setAlertMessage(transWithFallback('errorGetUserOrder', 'Lỗi khi lấy thông tin đơn hàng'));
          setAlertOpen(true);
        }
      } catch (error: any) {
        console.error('Lỗi khi gọi API lấy thông tin đơn hàng:', error);
        setAlertMessage(error.toString());
        setAlertOpen(true);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserOrder();
  }, [orderCode, status]);

  if (alertOpen) {
    return (
      <AutoCloseDialog
        open={alertOpen}
        message={!orderCode ? transWithFallback('noOrderCodeFound', 'Không tìm thấy mã đơn hàng.') : alertMessage}
        seconds={10}
        onClose={() => setAlertOpen(false)}
      />
    )
  }

  const isPaidProcessing =
    orderResponseDetail &&
    orderResponseDetail.status === "PENDING" &&
    Array.isArray(orderResponseDetail.Ticket) &&
    orderResponseDetail.Ticket.length > 0;

  const isPendingProcessing =
    orderResponseDetail &&
    orderResponseDetail.status === "PENDING" &&
    (!orderResponseDetail.Ticket || orderResponseDetail.Ticket.length === 0);

  const isSuccess =
    orderResponseDetail && orderResponseDetail.status === "SUCCESS";

  return (
    isLoading ? (
      <div className="flex flex-col items-center justify-center bg-gray-100 p-6 min-h-[60vh]">
        <div className="text-center mb-6">
          <div className="text-sky-900 text-6xl mb-4 animate-spin">⏳</div>
          <h1 className="text-3xl font-bold text-sky-900">
            {transWithFallback('loadingOrder', 'Đang lấy thông tin đơn hàng...')}
          </h1>
          <p className="mt-4 text-gray-600 text-base">
            {transWithFallback('supportLongWait', 'Nếu chờ quá lâu, vui lòng liên hệ hỗ trợ để được giải quyết nhanh nhất')}:
          </p>
          <SupportInfo />
        </div>
        {orderResponseDetail?.Showing && (
          <div className="bg-white p-6 rounded-lg shadow-md mt-4 w-full max-w-4xl">
            <h3 className="font-bold text-lg mb-3">{orderResponseDetail.Showing.title}</h3>
            <p><b>{transWithFallback('location', 'Địa điểm')}:</b> {orderResponseDetail.Showing.venue}</p>
            <p><b>{transWithFallback('address', 'Địa chỉ')}:</b> {orderResponseDetail.Showing.locationsString}</p>
            <p>
              <b>{transWithFallback('time', 'Thời gian')}:</b>{" "}
              {orderResponseDetail.Showing.startTime
                ? new Date(orderResponseDetail.Showing.startTime).toLocaleString("vi-VN")
                : ""}{" "}
              -{" "}
              {orderResponseDetail.Showing.endTime
                ? new Date(orderResponseDetail.Showing.endTime).toLocaleString("vi-VN")
                : ""}
            </p>
          </div>
        )}
      </div>
    ) : (
      orderResponseDetail && (
        <div className="flex flex-col items-center justify-center bg-gray-100 p-6 min-h-[60vh]">
          <div className="text-center w-full max-w-2xl flex flex-col items-center mb-4">
            <div className="text-green-500 text-6xl pb-2 animate-bounce">🎉</div>
            <h1 className="text-3xl font-bold text-green-600 pb-2">
              {isSuccess
                ? transWithFallback('paySuccess', 'Thanh toán thành công!')
                : isPaidProcessing
                  ? transWithFallback('ticketProcessing', 'Vé của bạn đang được xử lý!')
                  : isPendingProcessing
                    ? transWithFallback('orderProcessing', 'Đơn hàng của bạn đang được xử lý!')
                    : ""}
            </h1>
            <div className="bg-blue-100 text-sky-900 p-4 rounded-lg shadow-md w-full mb-3 text-center">
              <span className="font-semibold">{transWithFallback('orgMessage', 'Lời nhắn của BTC')}: </span>
              {isSuccess
                ? transWithFallback('mailNotice', 'Email sẽ được gửi trong vòng 15 phút. Vui lòng kiểm tra thêm thông tin chi tiết của đơn hàng được gửi đến địa chỉ email của bạn.')
                : isPaidProcessing
                  ? transWithFallback('ticketProcessingNotice', 'Vé của bạn đã thanh toán thành công và đang được xử lý, sẽ gửi về email sớm nhất.')
                  : isPendingProcessing
                    ? transWithFallback('orderProcessingNotice', 'Đơn hàng của bạn đang được xử lý. Vui lòng đợi xác nhận từ hệ thống hoặc liên hệ hỗ trợ nếu chờ lâu.')
                    : ""}
              <br />
              <span className="font-medium">
                {transWithFallback('youCanCheckTicket', 'Bạn có thể kiểm tra vé trong mục')}{' '}
                <a
                  href="/ticket"
                  className="font-bold rounded px-2 py-1 transition-colors hover:bg-[#0C4762] hover:text-blue-100"
                >
                  {transWithFallback('myTicket', 'Vé của tôi')}
                </a>
              </span>
            </div>
          </div>

          {/* Order Details Section */}
          {orderResponseDetail.Showing && <ShowingInfo showing={orderResponseDetail.Showing} />}

          {/* Order Information Table */}
          <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">{transWithFallback('orderInfo', 'Thông tin đơn hàng')}</h2>
            <OrderInfoTable order={orderResponseDetail} />

            {/* Hiện thông tin vé nếu đã có (SUCCESS hoặc PAID & đã có vé) */}
            {(status === "SUCCESS" || status === "PAID") && orderResponseDetail.Ticket && (
              <TicketResponseInfo ticketTypes={orderResponseDetail.Ticket} />
            )}
          </div>

          {/* Back to Homepage Button */}
          <div className="mt-6">
            <Link href="/">
              <button className="bg-[#0C4762] hover:bg-[#3BB8AE] text-white font-bold py-2 px-6 rounded-lg shadow-md transition-all">
                {transWithFallback('backToHome', 'Quay lại trang chủ')}
              </button>
            </Link>
          </div>
        </div>
      )
    )
  )
}