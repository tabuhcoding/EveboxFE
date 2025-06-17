'use client';

/* Package System */
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'tailwindcss/tailwind.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

/* Package Application */
import AlertDialog from "@/components/common/alertDialog";
import PaymentMethod from "./paymentMethod";
import TicketInformation from "./ticketInfo";
import Navigation from "../../_components/navigation";
import CountdownTimer from "../../_components/countdownTimer";
import { TicketType, EventProps, SelectedTicketsState } from "@/types/models/event/booking/seatmap.interface";
import { RedisInfo } from "@/types/models/event/redisSeat";
import { getRedisSeat } from "@/services/booking.service";

export default function PaymentPage({ showingId, seatMapId }: { showingId: string, seatMapId?: number }) {
  const t = useTranslations('common');

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [event, setEvent] = useState<EventProps | null>(null);
  const [totalTickets, setTotalTickets] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [selectedTickets, setSelectedTickets] = useState<SelectedTicketsState>({});
  const [ticketType, setTicketType] = useState<TicketType[] | null>(null);

  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [redisSeatInfo, setRedisSeatInfo] = useState<RedisInfo | null>(null);

  useEffect(() => {
    fetchEventInfo();
  }, []);

  useEffect(() => {
    const fetchRedisSeat = async () => {
      try {
        const res = await getRedisSeat(showingId);

        if (res?.statusCode === 200) {
          setRedisSeatInfo(res.data);
        }
        else {
          setAlertMessage(transWithFallback('errorGetRedisSeat', 'Lỗi khi lấy thông tin từ redis'));
          setAlertOpen(true);
        }
      } catch (error: any) {
        console.error('Lỗi khi gọi lấy thông tin từ redis:', error);
        setAlertMessage(error.toString());
        setAlertOpen(true);
      }
    }

    if (showingId) {
      fetchRedisSeat();
    }
  }, [showingId]);

  const fetchEventInfo = () => {
    const storedEvent = localStorage.getItem('event');
    const storedTotalTickets = localStorage.getItem('totalTickets');
    const storedTotalAmount = localStorage.getItem('totalAmount');
    const storedTicketType = localStorage.getItem('ticketTypeArr');
    const storedSelectedTickets = localStorage.getItem('selectedTickets');

    if (storedEvent) setEvent(JSON.parse(storedEvent));
    if (storedTotalTickets) setTotalTickets(Number(storedTotalTickets));
    if (storedTotalAmount) setTotalAmount(Number(storedTotalAmount));
    if (storedTicketType) setTicketType(JSON.parse(storedTicketType));
    if (storedSelectedTickets) setSelectedTickets(JSON.parse(storedSelectedTickets));
  }

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    if (!msg || msg.startsWith('common.')) return fallback;
    return msg;
  };

  return (
    <>
      <div className="mt-5 mb-5">
        <Navigation title="Thanh toán" />

        <div className="fixed top-10 right-10 mt-4">
          <CountdownTimer expiredTime={redisSeatInfo?.expiredTime ? redisSeatInfo?.expiredTime : 15} />
        </div>

        <div className="px-32 py-0">
          <div className="row align-items-start mt-4">
            <PaymentMethod onMethodSelected={(method) => setSelectedMethod(method)} />
            {event && ticketType && (
              <TicketInformation 
                event={event}
                totalTickets={totalTickets}
                totalAmount={totalAmount}
                ticketType={ticketType}
                paymentMethod={selectedMethod}
                showingId={showingId}
                seatMapId={seatMapId} 
                selectedTickets={selectedTickets}
                redisInfo={redisSeatInfo}
              />
            )}
          </div>
        </div>
      </div>
      <AlertDialog
        message={alertMessage}
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
      />
    </>
  )
}