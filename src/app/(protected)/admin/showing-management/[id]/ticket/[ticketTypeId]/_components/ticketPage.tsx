'use client';

/* Package System */
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";
import { HttpStatusCode } from "axios";
import toast from "react-hot-toast";

/* Package Application */
import { ShowingInTicketTypeDetail, TicketTypeDetailProps } from "@/types/models/admin/showingManagement.interface";
import { getTicketTypeDetailAdmin } from "@/services/event.service";
import { formatCurrency } from "@/utils/helpers";
import TicketPageLoading from "./ticketPageLoading";
import { useAuth } from "contexts/auth.context";

export default function TicketDetailPage() {
  const t = useTranslations('common');
  const params = useParams();
  const router = useRouter();
  const { session } = useAuth();

  const showingId = params?.id as string;
  const ticketTypeId = params?.ticketTypeId as string;

  const [showing, setShowing] = useState<ShowingInTicketTypeDetail | null>(null);
  const [ticketType, setTicketType] = useState<TicketTypeDetailProps | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        if (showingId && ticketTypeId) {
          const res = await getTicketTypeDetailAdmin(showingId, ticketTypeId, session?.user?.accessToken || "");

          if (res?.statusCode === HttpStatusCode.Ok) {
            setShowing(res.data);
            setTicketType(res.data.ticketType);
          }
          else {
            toast.error(`${transWithFallback('errorWhenFetchShowings', 'Lỗi khi tải dữ liệu loại vé')}: ${res.message}`)
          }
        }
      } catch (error) {
        console.error(`${transWithFallback('errorWhenFetchTicketType', 'Lỗi khi tải dữ liệu loại vé')}`, error);
        toast.error(`${transWithFallback('errorWhenFetchTicketType', 'Lỗi khi tải dữ liệu loại vé')}: ${error}`)
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [showingId, ticketTypeId]);

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    return !msg || msg.startsWith('common.') ? fallback : msg;
  };

  const renderTicketStatus = (status: string) => {
    switch (status) {
      case "book_now":
        return (
          <span className="min-w-[100px] text-center inline-block px-4 py-1 rounded-full text-xs font-semibold border bg-[#9EF5CF] text-[#0C4762] border-[#9EF5CF]">
            {transWithFallback('bookNow', 'Đang mở bán vé')}
          </span>
        );
      case "sold_out":
        return (
          <span className="min-w-[100px] text-center inline-block px-4 py-1 rounded-full text-xs font-semibold border bg-[#FFC9C9] text-[#FF0000] border-[#FFC9C9]">
            {transWithFallback('soldOut', 'Hết vé')}
          </span>
        );
      case "sale_closed":
        return (
          <span className="min-w-[100px] text-center inline-block px-4 py-1 rounded-full text-xs font-semibold border bg-[#F4EEEE] text-[#979797] border-[#F4EEEE]">
            {transWithFallback('sale_closed', 'Ngừng bán')}
          </span>
        );
      case "not_open":
        return (
          <span className="min-w-[100px] text-center inline-block px-4 py-1 rounded-full text-xs font-semibold border bg-[#F4EEEE] text-[#979797] border-[#F4EEEE]">
            {transWithFallback('notOpen', 'Chưa mở bán')}
          </span>
        );
      case "register_now":
        return (
          <span className="min-w-[100px] text-center inline-block px-4 py-1 rounded-full text-xs font-semibold border bg-[#9EF5CF] text-[#0C4762] border-[#9EF5CF]">
            {transWithFallback('registerNow', 'Đang mở đăng ký')}
          </span>
        );
      case "register_closed":
        return (
          <span className="min-w-[100px] text-center inline-block px-4 py-1 rounded-full text-xs font-semibold border bg-[#F4EEEE] text-[#979797] border-[#F4EEEE]">
            {transWithFallback('registerClosed', 'Đã đóng đăng ký')}
          </span>
        );
      default:
        return <span className="min-w-[100px] text-center inline-block px-4 py-1 rounded-full text-xs font-semibold border bg-[#F4EEEE] text-[#979797] border-[#F4EEEE]">{transWithFallback('unknownStatus', 'Trạng thái không xác định')}</span>;
    }
  };

  return (
    <>
      <div className="flex items-center space-x-2">
        <ArrowLeft onClick={() => router.back()} size={30} className="text-[#0C4762] cursor-pointer hover:opacity-80 transition-opacity duration-200" />
        <h1 className="text-2xl font-bold text-[#0C4762] mb-1">{transWithFallback('ticketTypeDetailInfo', 'Thông tin chi tiết vé')}</h1>
      </div>

      <div className="border-t-2 border-[#0C4762] mt-2"></div>

      {isLoading ? (
        <TicketPageLoading />
      ) : (
        <>
          <div className="detail-event max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6 mt-8 mb-6">
            <div className="px-6">
              <p>
                <span className="font-semibold">{transWithFallback('eventName', 'Tên sự kiện')}: </span> {showing?.event.title}
              </p>
              <p className="mt-2">
                <span className="font-semibold">{transWithFallback('showDate', 'Ngày diễn')}: </span>
                {new Date(showing?.startTime ?? "").toLocaleDateString('vi-VN')}
              </p>
              <p className="mt-2">
                <span className="font-semibold">{transWithFallback('startTime', 'Thời gian bắt đầu')}: </span>
                {new Date(showing?.startTime ?? "").toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false })} - {new Date(showing?.endTime ?? "").toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false })}
              </p>
            </div>
          </div>

          <div className="detail-event max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6 mt-3 mb-6">
            <div className="flex justify-center">
              <img className="rounded-md mt-4" alt="Ticket"
                src={(ticketType?.imageUrl && ticketType?.imageUrl !== "" && !ticketType?.imageUrl.includes('https://domain.com') && ticketType?.imageUrl !== "Default Image URL") ? ticketType?.imageUrl : "https://res.cloudinary.com/de66mx8mw/image/upload/v1744458011/defaultImgEvent_spjrst.png"}
                width={800} height={150}
              />
            </div>
            <div className="p-6">
              <p>
                <span className="font-semibold">{transWithFallback('ticketName', 'Tên vé')}: </span> {ticketType?.name}
              </p>
              <p className="mt-2">
                <span className="font-semibold">{transWithFallback('description', 'Mô tả')}: </span> {ticketType?.description}
              </p>
              <p className="mt-2">
                <span className="font-semibold">{transWithFallback('ticketPrice', 'Giá vé')}: </span>
                {ticketType?.price === 0 ? transWithFallback('free', 'Miễn phí') : `${formatCurrency(ticketType?.price ?? 0)} VNĐ`}
              </p>
              <p className="mt-2">
                <span className="font-semibold">{transWithFallback('saleStartTime', 'Thời gian mở bán')}: </span>
                {`${new Date(ticketType?.startTime ?? "").toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false })} - ${new Date(ticketType?.startTime ?? "").toLocaleDateString('vi-VN')}`}
              </p>
              <p className="mt-2">
                <span className="font-semibold">{transWithFallback('saleEndTime', 'Thời gian ngừng bán')}: </span>
                {`${new Date(ticketType?.endTime ?? "").toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false })} - ${new Date(ticketType?.endTime ?? "").toLocaleDateString('vi-VN')}`}
              </p>
              <p className="mt-2">
                <span className="font-semibold">{transWithFallback('minQtyPerOrder', 'Số lượng vé mua tối thiểu/lần')}: </span> {ticketType?.minQtyPerOrder}
              </p>
              <p className="mt-2">
                <span className="font-semibold">{transWithFallback('maxQtyPerOrder', 'Số lượng vé mua tối đa/lần')}: </span> {ticketType?.maxQtyPerOrder}
              </p>
              <p className="mt-2">
                <span className="font-semibold">{transWithFallback('totalTicketsAmount', 'Tổng số lượng vé')}: </span> {ticketType?.quantity}
              </p>
              <p className="mt-2">
                <span className="font-semibold">{transWithFallback('soldTickets', 'Số lượng vé đã bán')}: </span> {ticketType?.sold}
              </p>
              <p className="mt-2">
                <span className="font-semibold">{transWithFallback('status', 'Trạng thái')}: </span>
                {renderTicketStatus(ticketType?.status ?? "")}
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
}