'use client';

/* Package System */
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Calendar, Ticket } from "lucide-react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'tailwindcss/tailwind.css';

/* Package Application */
import { useI18n } from "app/providers/i18nProvider";
import AlertDialog from "components/common/alertDialog";
import { TicketInforProps, SelectSeatPayload } from "types/models/event/booking/seatmap.interface";
import { selectSeat } from "services/event.service";

export default function TicketInfor({
  event,
  totalTickets,
  totalAmount,
  hasSelectedTickets,
  selectedTickets,       // object dạng {[ticketTypeId]: {quantity, seatIds, sectionId}}
  ticketType,            // mảng loại vé
  selectedSeatIds,
  showingId,
  onClearSelection
}: TicketInforProps) {
  const t = useTranslations('common');
  const { locale } = useI18n();
  const router = useRouter();

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    if (!msg || msg.startsWith('common.')) return fallback;
    return msg;
  };

  const handleContinue = async () => {
    if (!showingId || !session?.user?.accessToken) {
      setAlertMessage(transWithFallback("pleaseLogin", "Vui lòng đăng nhập để truy cập vào trang này!"));
      setAlertOpen(true);
      return;
    }

    const ticketTypeSelection = Object.entries(selectedTickets)
      .filter(([_, info]) => info.quantity > 0)
      .map(([tickettypeId, info]) => ({
        tickettypeId: tickettypeId,
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
        localStorage.setItem('selectedSeatIds', JSON.stringify(selectedSeatIds));
        // localStorage.setItem('ticketTypeId', selectedTicketType?.id.toString() || '');
        localStorage.setItem('showingId', showingId || '');
        router.push(`/event/${event.id}/booking/payment?showingId=${showingId}`);
      } else {
        setAlertMessage(transWithFallback("errorLockSeat", "Lỗi khi khóa ghế. Vui lòng thử lại sau."));
        setAlertOpen(true);
        onClearSelection?.();
      }
    } catch (error) {
      console.error('Lỗi khi gọi API lock-seat:', error);
      setAlertMessage(transWithFallback("errorLockSeat", "Lỗi khi khóa ghế. Vui lòng thử lại sau."));
      setAlertOpen(true);
      onClearSelection?.();
    } finally {
      setIsLoading(false);
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
                {new Date(event.startDate).toLocaleString(locale === "vi" ? 'vi-VN' : 'en-US', {
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
            <div className="flex items-center space-x-2 mt-4">
              <Ticket size={28} /> <span className="text-gray-700 text-xl">x{totalTickets}</span>
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
      />
    </>
  );
}