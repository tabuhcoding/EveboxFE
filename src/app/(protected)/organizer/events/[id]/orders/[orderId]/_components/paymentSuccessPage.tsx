'use client';

/* Package System */
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

/* Package Application */
import { useAuth } from "@/contexts/auth.context";

import OrderInfoTable from "./orderInfoTable";
import ShowingInfo from "./showingInfo";
import SupportInfo from "./supportInfo";
import TicketResponseInfo from "./ticketResponseInfo";
import { getOrderById } from "@/services/booking.service";
import { IUserTicketById } from "@/types/models/ticket/ticketInfoById";

export default function PaymentSuccessPage({ orderCode }: { orderCode?: string | undefined }) {
  const t = useTranslations('common');
  const { session } = useAuth();

  const [, setAlertMessage] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [orderResponseDetail, setOrderResponseDetail] = useState<IUserTicketById | null>(null);

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    if (!msg || msg.startsWith('common.')) return fallback;
    return msg;
  };

  useEffect(() => {
    const fetchUserOrder = async () => {
      setIsLoading(true);
      try {
        const res = await getOrderById(orderCode || "0", session?.user?.accessToken || "");

        if (res.statusCode === 200) {
          setOrderResponseDetail(res.data);
        }
        else {
          setAlertMessage(transWithFallback('errorGetUserOrder', 'Lỗi khi lấy thông tin đơn hàng'));
        }
      } catch (error: any) {
        console.error('Lỗi khi gọi API lấy thông tin đơn hàng:', error);
        setAlertMessage(error.toString());
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserOrder();
  }, [orderCode]);

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
            
          </div>

          {/* Order Details Section */}
          {orderResponseDetail.Showing && <ShowingInfo showing={orderResponseDetail.Showing} />}

          {/* Order Information Table */}
          <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">{transWithFallback('orderInfo', 'Thông tin đơn hàng')}</h2>
            <OrderInfoTable order={orderResponseDetail} />

            {/* Hiện thông tin vé nếu đã có (SUCCESS hoặc PAID & đã có vé) */}
            { orderResponseDetail.Ticket && (
              <TicketResponseInfo ticketTypes={orderResponseDetail.Ticket} />
            )}
          </div>
        </div>
      )
    )
  )
}