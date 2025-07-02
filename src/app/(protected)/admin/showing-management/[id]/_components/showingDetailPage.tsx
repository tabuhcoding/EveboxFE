'use client';

/* Package System */
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

/* Package Application */
import { ShowingDetail } from "@/types/models/admin/showingManagement.interface";
import { getShowingDetailAdmin } from "@/services/event.service";
import ShowingDetailLoading from "./showingDetailLoading";
import TicketTable from "./ticketTable";
import { HttpStatusCode } from "axios";

export default function ShowingDetailPage({ showingId }: { showingId: string }) {
  const t = useTranslations('common');
  const router = useRouter();
  const { data: session } = useSession();

  const [showing, setShowing] = useState<ShowingDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchShowingDetail = async () => {
      setIsLoading(true);
      try {
        const res = await getShowingDetailAdmin(showingId, session?.user?.accessToken || "");

        if (res?.statusCode === HttpStatusCode.Ok) {
          setShowing(res.data);
        }
        else {
          toast.error(`${transWithFallback('errorWhenFetchShowings', 'Lỗi khi tải dữ liệu suất diễn')}: ${res.message}`)
        }
      } catch (error) {
        console.error(`${transWithFallback('errorWhenFetchShowings', 'Lỗi khi tải dữ liệu suất diễn')}`, error);
        toast.error(`${transWithFallback('errorWhenFetchShowings', 'Lỗi khi tải dữ liệu suất diễn')}: ${error}`)
      } finally {
        setIsLoading(false);
      }
    };

    fetchShowingDetail();
  }, [showingId]);

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    return !msg || msg.startsWith('common.') ? fallback : msg;
  };

  function renderShowingStatus(status: string) {
    switch (status) {
      case "register_now":
        return (
          <span className="text-center inline-block px-4 py-1 rounded-full text-xs font-semibold border bg-[#C7F2A4] text-[#166534] border-[#A3E635]">
            {transWithFallback('registerNow', 'Đang mở đăng ký')}
          </span>
        );
      case "book_now":
        return (
          <span className="text-center inline-block px-4 py-1 rounded-full text-xs font-semibold border bg-[#9EF5CF] text-[#0C4762] border-[#9EF5CF]">
            {transWithFallback('bookNow', 'Đang mở bán vé')}
          </span>
        );
      case "sold_out":
        return (
          <span className="text-center inline-block px-4 py-1 rounded-full text-xs font-semibold border bg-[#FFC9C9] text-[#FF0000] border-[#FFC9C9]">
            {transWithFallback('soldOut', 'Hết vé')}
          </span>
        );
      case "not_open":
        return (
          <span className="text-center inline-block px-4 py-1 rounded-full text-xs font-semibold border bg-gray-200 text-gray-700 border-gray-300">
            {transWithFallback('notOpen', 'Chưa mở bán')}
          </span>
        );
      case "register_closed":
        return (
          <span className="text-center inline-block px-4 py-1 rounded-full text-xs font-semibold border bg-orange-100 text-orange-700 border-orange-300">
            {transWithFallback('registerClosed', 'Đã đóng đăng ký')}
          </span>
        );
      default:
        return (
          <span className="text-center inline-block px-4 py-1 rounded-full text-xs font-semibold border bg-gray-100 text-gray-400 border-gray-200">
            {transWithFallback('unknownStatus', 'Không xác định')}
          </span>
        );
    }
  }

  return (
    isLoading ? (
      <ShowingDetailLoading />
    ) : (
      <>
        <div className="flex items-center space-x-2">
          <ArrowLeft onClick={() => router.back()} size={30} className="text-[#0C4762] cursor-pointer hover:opacity-80 transition-opacity duration-200" />
          <h1 className="text-2xl font-bold text-[#0C4762] mb-1">{transWithFallback('showingInfo', 'Thông tin suất diễn')}</h1>
        </div>

        <div className="border-t-2 border-[#0C4762] mt-2"></div>

        <h1 className="text-2xl font-semibold text-center mt-6">{showing?.event.title}</h1>

        {/* Showing Status */}
        <div className="flex justify-center mt-3 mb-2">
          {showing?.status && renderShowingStatus(showing.status)}
        </div>

        {/* Seat Map */}
        <div className="seat-map px-8">
          {showing?.seatMapId === 0 ? '' : (
            <>
              <h2 className="text-xl font-semibold mt-6 mb-3">{transWithFallback('seatmap', 'Sơ đồ chỗ ngồi')}</h2>
              <div className="flex justify-center mb-6">
                <img className="rounded-md" alt="Seat map"
                  src={"https://res.cloudinary.com/de66mx8mw/image/upload/v1743393414/background.jpg.jpg"}
                  width={800} height={150}
                />
              </div>
            </>
          )}
        </div>

        {/* Thời gian chi tiết */}
        <h2 className="text-xl font-semibold mt-6 mb-3 px-8">{transWithFallback('detailTime', 'Thời gian chi tiết')}</h2>
        <div className="detail-event max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6 mt-3 mb-6">
          <p>
            <span className="font-semibold">{transWithFallback('showDate', 'Ngày diễn')}: </span> {new Date(showing?.startTime ?? "").toLocaleDateString("vi-VN")}
          </p>
          <p className="mt-2">
            <span className="font-semibold">{transWithFallback('startTime', 'Thời gian bắt đầu')}: </span>
            {new Date(showing?.startTime ?? "").toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </p>
          <p className="mt-2">
            <span className="font-semibold">{transWithFallback('endTime', 'Thời gian kết thúc')}: </span>
            {new Date(showing?.endTime ?? "").toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </p>
        </div>

        <h2 className="text-xl font-semibold mt-6 mb-3 px-8">{transWithFallback('ticketTypeManagement', 'Quản lý các loại vé')}</h2>

        <TicketTable showingID={showing?.id ?? ""} ticketTypes={showing?.ticketTypes ?? []} />
      </>
    )
  )
}