'use client';

/* Package System */
import { Icon } from "@iconify/react";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { Calendar, Ticket } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'tailwindcss/tailwind.css';

/* Package Application */
import { selectSeat, unselectSeat, getRedisSeat } from "@/services/booking.service";
import { useI18n } from "app/providers/i18nProvider";
import AlertDialog from "components/common/alertDialog";
import { TicketInforProps, SelectSeatPayload } from "types/models/event/booking/seatmap.interface";
import { RedisInfo } from "@/types/models/event/redisSeat";
import { useAuth } from "@/contexts/auth.context";

export default function TicketInfor({
  event,
  showingStartTime,
  totalTickets,
  totalAmount,
  hasSelectedTickets,
  selectedTickets,       // object dạng {[ticketTypeId]: {quantity, seatIds, sectionId}}
  ticketType,            // mảng loại vé
  selectedSeatIds,
  showingId,
  onClearSelection,
  seatMapId,
}: TicketInforProps) {
  const t = useTranslations('common');
  const { locale } = useI18n();
  const router = useRouter();

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [href, setHref] = useState("");
  const [redisSeatInfo, setRedisSeatInfo] = useState<RedisInfo | null>(null);

  const { session } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchRedisSeat = async () => {
      if (showingId) {
        try {
          const response = await getRedisSeat(showingId);
          if (response?.statusCode === 200) {
            setRedisSeatInfo(response.data);
          } else {
            setRedisSeatInfo(null);
          }
        } catch (error: any) {
          setRedisSeatInfo(null);
          if (!error?.toString().includes('expired')) {
            console.error('Error fetching redis seat:', error);
          }
        }
      }
    }
    fetchRedisSeat();
  }, [showingId]);

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    if (!msg || msg.startsWith('common.')) return fallback;
    return msg;
  };

  const handleContinue = async () => {
    if (!showingId || !session?.user?.accessToken) {
      setAlertMessage(transWithFallback("pleaseLogin", "Vui lòng đăng nhập để truy cập vào trang này!"));
      setHref("/login");
      setAlertOpen(true);
      return;
    }

    const ticketTypeSelection = Object.entries(selectedTickets)
      .filter(([_, info]) => info.quantity > 0)
      .map(([ticketTypeId, info]) => ({
        tickettypeId: ticketTypeId,
        quantity: info.quantity,
        seatInfo: (info.seatIds || []).map(id => ({ seatId: id })),
        ...(info.sectionId ? { sectionId: info.sectionId } : {}), // optional
      }));

    if (ticketTypeSelection.length === 0) {
      setAlertMessage(transWithFallback("errorSelectTicket", "Vui lòng chọn vé trước khi tiếp tục."));
      setAlertOpen(true);
      return;
    }

    const payload: SelectSeatPayload = {
      showingId: showingId,
      ticketTypeSelection,
    };

    setIsLoading(true);
    try {
      const response = await selectSeat(payload, session.user.accessToken);
      if (response.statusCode === 200) {
        // Navigate to payment page with the selected showingId
        localStorage.setItem('event', JSON.stringify(event));
        localStorage.setItem('totalTickets', totalTickets.toString());
        localStorage.setItem('totalAmount', totalAmount.toString());
        localStorage.setItem('hasSelectedTickets', hasSelectedTickets.toString());
        localStorage.setItem('selectedTickets', JSON.stringify(selectedTickets));
        // localStorage.setItem('selectedTicketType', JSON.stringify(selectedTicketType));
        localStorage.setItem('ticketTypeArr', JSON.stringify(ticketType));
        localStorage.setItem('selectedSeatIds', JSON.stringify(selectedSeatIds));
        // localStorage.setItem('ticketTypeId', selectedTicketType?.id.toString() || '');
        localStorage.setItem('showingId', showingId || '');
        router.push(`/event/${event.id}/booking/question-form?showingId=${showingId}${seatMapId ? `&seatMapId=${seatMapId}` : ''}`);
      } else {
        setAlertMessage(transWithFallback("errorLockSeat", "Lỗi khi khóa ghế. Vui lòng thử lại sau."));
        setAlertOpen(true);
        onClearSelection?.();
      }
    } catch (error: any) {
      console.error('Lỗi khi gọi API lock-seat:', error);
      const errorString = error.toString();
      let errorNoti = errorString;
      if (errorString.includes("quantity exceeds")) {
        errorNoti = transWithFallback('ticketQuantityExceed', 'Số lượng được chọn vượt quá vé có sẵn cho loại vé này trong phần được chỉ định')
      }
      setAlertMessage(errorNoti);
      setAlertOpen(true);
      onClearSelection?.();
    } finally {
      setIsLoading(false);
    }
  }

  const handleUnSelectSeat = async () => {
    if (!showingId || !session?.user?.accessToken || !redisSeatInfo) {
      onClearSelection?.();
      setShowConfirmDialog(false);
      return;
    }

    try {
      const res = await unselectSeat(showingId ?? "", session?.user?.accessToken || "");
      if (res?.statusCode !== 200) {
        setAlertMessage(`${transWithFallback('errorUnselectSeat', 'Lỗi khi hủy chọn vé')}: ${res?.message}`);
        setAlertOpen(true);
      }
    } catch (error: any) {
      setAlertMessage(error);
      setAlertOpen(true);
    } finally {
      onClearSelection?.();
      setIsLoading(false);
      setShowConfirmDialog(false);
      window.location.reload();
    }
  }

  return (
    <>
      <div className="info-container flex flex-col md:flex-row px-32 py-8 items-stretch space-y-4 md:space-y-0 md:space-x-6 min-h-[540]">
        <div className="w-full md:w-2/3">
          <Image
            src={`${event?.imgPosterUrl}` || '/images/event.png'}
            alt="Event"
            width={800}
            height={540}
            className="object-cover rounded-lg"
            style={{
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          />
        </div>

        <div className="w-full md:w-1/3 pt-2 pb-2 flex flex-col justify-between">
          <div className='ticket-info-wrapper'>
            <h2 className="text-lg font-semibold">{event.title}</h2>
            <div className="text-gray-500 flex items-center space-x-2 mt-4">
              <Calendar size={18} />
              <span>
                {showingStartTime
                  ? new Date(showingStartTime).toLocaleString(locale === "vi" ? 'vi-VN' : 'en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                  : new Date(event.startDate).toLocaleString(locale === "vi" ? 'vi-VN' : 'en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
              </span>
            </div>
            <div className="text-gray-500 flex items-center space-x-2 mt-2">
              <i className="bi bi-geo-alt-fill mr-1"></i> <span>{event.venue}</span>
            </div>
            {/* <CollapsibleDescription htmlContent={event.description} maxHeight={140} /> */}
          </div>

          <div className='action-wrapper pb-4'>
            {/* Selected tickets */}
            {!isLoading &&
              Object.entries(selectedTickets).filter(([_, info]) => info.quantity > 0).length > 0 && (
                <div className="mb-2">
                  <div className="text-sm font-semibold text-[#0C4762] mb-1">{transWithFallback('selectedTickets', 'Các vé đã chọn')}:</div>
                  <ul className="space-y-1">
                    {Object.entries(selectedTickets).map(([ticketTypeId, info]) => {
                      if (!info.quantity || info.quantity === 0) return null;

                      const ticketTypeObj = ticketType?.find(tt => tt.id === ticketTypeId);
                      return (
                        <li key={ticketTypeId} className="flex items-center gap-2 text-sm">
                          <span className="inline-block w-3 h-3 rounded mr-1" style={{ background: ticketTypeObj?.color }} />
                          <span className="font-semibold">{ticketTypeObj?.name || ticketTypeId}</span>
                          {info.sectionId && info.name && (
                            <span className="ml-1 text-xs text-gray-500">
                              (
                              {Array.isArray(info.name) ? info.name.join(', ') : info.name}
                              )
                            </span>
                          )}
                          <span className="ml-auto">×{info.quantity}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

            {/* Total amount of selected tickets */}
            <div className="flex justify-between items-center mt-4 px-2 py-2 bg-gray-50 rounded-lg shadow-sm">
              <div className="flex items-center space-x-2">
                <Ticket size={28} />
                <span className="text-gray-800 text-lg font-medium">x{totalTickets}</span>
              </div>
              <button
                className={`ml-4 px-4 py-1.5 text-sm font-semibold rounded-md transition ${hasSelectedTickets
                  ? 'bg-red-100 text-red-600 hover:bg-red-200'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                onClick={() => setShowConfirmDialog(true)}
                disabled={!hasSelectedTickets}
              >
                {transWithFallback('clearTicket', 'Hủy chọn vé')}
              </button>
            </div>

            <button
              className={`w-full choose-ticket-btn items-center p-2 rounded-lg mt-4 ${hasSelectedTickets
                ? 'bg-[#51DACF] text-[#0C4762] font-bold hover:bg-[#3BB8AE]'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              disabled={!hasSelectedTickets}
              onClick={handleContinue}
            >
              {!isLoading ? (
                hasSelectedTickets
                  ? `${t("continue") ?? "Tiếp tục"} - ${totalAmount.toLocaleString()}đ`
                  : `${t("pleaseChooseTicket") ?? "Vui lòng chọn vé"}`
              ) : (
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              )}
              {/* {hasSelectedTickets
                            ? `${t("continue") ?? "Tiếp tục"} - ${totalAmount.toLocaleString()}đ`
                            : `${t("pleaseChooseTicket") ?? "Vui lòng chọn vé"}`} */}
            </button>
          </div>
        </div>
      </div>
      <AlertDialog
        message={alertMessage}
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
        {...href ? { href } : {}}
      />

      <Dialog open={showConfirmDialog} onClose={() => setShowConfirmDialog(false)}>
        <div className="text-white dialog-header px-4 py-3 justify-center items-center flex relative" style={{ background: '#0C4762' }}>
          <DialogTitle className="!m-0 !p-0 text-lg text-center font-bold">
            {t("notify") ?? "Thông báo"}
          </DialogTitle>
          <button onClick={() => setShowConfirmDialog(false)} className="absolute right-2 top-2 px-1 py-1 close-btn">
            <Icon icon="ic:baseline-close" width="20" height="20" />
          </button>
        </div>

        <DialogContent className="p-4 flex flex-col justify-center items-center">
          <Icon icon="material-symbols:warning" width="50" height="50" color="#f59e0b" />
          <p className="text-center mt-3 mb-6">
            {t("confirmFirst") ?? "Bạn có chắc chắn muốn xóa"} <strong>{totalTickets}</strong> {t("confirmSecond") ?? "vé đã chọn không?"}
          </p>
          <div className="flex space-x-4">
            <button className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 text-sm" onClick={() => setShowConfirmDialog(false)}>
              {t("btnCancel") ?? "Hủy"}
            </button>
            <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
              onClick={handleUnSelectSeat}>
              {t("btnDeleteAll") ?? "Xóa tất cả vé"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}