'use client';

/* Package System */
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'tailwindcss/tailwind.css';

/* Package Application */
import AlertDialog from '@/components/common/alertDialog';
import Error from 'app/(frontpage)/error';
import Loading from 'app/(protected)/(user)/my-profile/loading';
import { getSeatMap, getShowingData } from 'services/event.service';
import { getRedisSeat } from '@/services/booking.service';
import { SeatMap, SeatmapType, ShowingData, TicketType } from 'types/models/event/booking/seatmap.interface';
import { SelectTicketPageProps, SelectedTicketsState } from 'types/models/event/booking/selectTicket.interface';
import { EventDetail } from 'types/models/event/eventdetail/event.interface';
import { useAuth } from '@/contexts/auth.context';

import Navigation from '../../_components/navigation';

import SeatMapComponent from './seatmap';
import SeatMapSectionComponent from './seatmapSection';
import SelectTicket from './selectTicket';
import TicketInfor from './ticketInfo';

export default function SelectTicketPage({ showingId, serverEvent, seatMapId }: SelectTicketPageProps) {
  const t = useTranslations('common');
  const { session } = useAuth();

  const [selectedTickets, setSelectedTickets] = useState<SelectedTicketsState>({});
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  const [event] = useState<EventDetail | null>(serverEvent);
  const [ticketType, setTicketType] = useState<TicketType[]>([]);
  const [seatmapType, setSeatmapType] = useState<SeatmapType>(SeatmapType.NOT_A_SEATMAP);

  const [seatMapData, setSeatMapData] = useState<SeatMap | ShowingData | null>(null);
  const [isLoadingSeatmap, setIsLoadingSeatmap] = useState(true);
  const [seatmapError, setSeatmapError] = useState<string | "">("");
  const [selectedSeatIds, setSelectedSeatIds] = useState<number[]>([]);
  const [startShowTime, setStartShowTime] = useState<Date | null>(null);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [href, setHref] = useState("");

  useEffect(() => {
    const fetchRedisSeat = async () => {
      localStorage.removeItem('timeLeft');
      localStorage.removeItem('timestamp');
      try {
        const res = await getRedisSeat(showingId);
        if (res?.statusCode === 200 && res.data?.ticketTypeSelection) {
          const redisTickets = res.data.ticketTypeSelection.reduce((acc, item) => {
            acc[item.tickettypeId] = {
              quantity: item?.seatInfo?.length || item?.quantity || 0,
              sectionId: item?.sectionId || 0,
              seatIds: item?.seatInfo?.map(seat => seat.seatId) || [],
              name: [item?.ticketTypeName]
            };
            return acc;
          }, {} as SelectedTicketsState);

          setSelectedTickets(redisTickets);
          setSelectedSeatIds(res.data.ticketTypeSelection.flatMap(item =>
            item.seatInfo?.map(seat => seat.seatId) || []));
        }
      } catch (error: any) {
        if (!error.toString().includes('expired')) {
          console.error('Error fetching redis seat:', error);
        }
      }
    };

    if (showingId) {
      fetchRedisSeat();
    }
  }, [showingId]);

  useEffect(() => {
    if (!session?.user?.accessToken) {
      setAlertMessage(transWithFallback("pleaseLogin", "Vui lòng đăng nhập để truy cập vào trang này!"));
      setHref("/login");
      setAlertOpen(true);
    }
  })

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    if (!msg || msg.startsWith('common.')) return fallback;
    return msg;
  };

  const clearSelection = () => {
    setSelectedTickets({});
    setSelectedTicket(null);
    setSelectedSeatIds([]);
  };

  useEffect(() => {
    if (!showingId) return;

    localStorage.setItem('showingId', showingId);

    setIsLoadingSeatmap(true);
    setSeatmapError("");

    if (seatMapId === 0) {
      getShowingData(showingId)
        .then((data) => {
          if (data?.data) {
            setSeatMapData(data.data);
            setStartShowTime(data.data.startTime);
            setTicketType(data.data?.TicketType || []);
          }
          else {
            setSeatmapError("Không tìm thấy dữ liệu showing");
          }
        })
        .catch(() => setSeatmapError(transWithFallback('errorShowing', 'Lỗi khi dữ liệu showing')))
        .finally(() => setIsLoadingSeatmap(false));
    }
    else {
      getSeatMap(showingId)
        .then((seatMapResponse) => {
          if (seatMapResponse?.data) {
            setSeatmapType(seatMapResponse.data.seatMapType || SeatmapType.NOT_A_SEATMAP);
            setSeatMapData(seatMapResponse.data);
            return getShowingData(showingId);
          }
          else {
            setSeatmapError("Không tìm thấy dữ liệu sơ đồ chỗ ngồi");
            return null;
          }
        })
        .then((showingResponse) => {
          if (showingResponse?.data?.TicketType) {
            const sortedTicketType = [...showingResponse.data.TicketType].sort((a, b) => a.position - b.position);
            setTicketType(sortedTicketType);
          }
          if (showingResponse?.data?.startTime) {
            setStartShowTime(showingResponse.data.startTime);
          }
        })
        .catch(() => setSeatmapError(transWithFallback('errorShowing', 'Lỗi khi dữ liệu showing')))
        .finally(() => setIsLoadingSeatmap(false));
    }
  }, [showingId, seatMapId]);

  const isShowingData = (data: unknown): data is ShowingData => {
    return !!(data && typeof data === "object" && "TicketType" in data);
  };

  const totalTickets = Object.values(selectedTickets).reduce((a, b) => a + (b.quantity || 0), 0);

  useEffect(() => {
    if (!seatMapData) return;

    if ("TicketType" in seatMapData) {
      const newTotal = Object.entries(selectedTickets).reduce((sum, [id, ticketObj]) => {
        const ticket = seatMapData?.TicketType?.find((t) => t.id === id);
        return sum + (ticket?.price || 0) * (ticketObj.quantity || 0);
      }, 0);

      setTotalAmount(newTotal);
    }
    else {
      const newTotal = Object.entries(selectedTickets).reduce((sum, [ticketTypeId, ticketObj]) => {
        const ticket = ticketType.find((t) => t.id === ticketTypeId);
        return sum + (ticket?.price || 0) * (ticketObj.quantity || 0);
      }, 0);
      setTotalAmount(newTotal);
    }
  }, [selectedTickets, seatMapData, ticketType]);

  const handleSeatSelectionChange = (
    seat: { id: number; ticketTypeId: string; label: string[] },
    isSelected: boolean,
    quantity?: number,
    sectionId?: number
  ) => {
    setSelectedTickets((prev) => {
      const ticketTypeId = seat.ticketTypeId;
      if (quantity && sectionId) {
        // Dạng SELECT_SECTION: quantity và sectionId là cố định, không có seatIds
        return {
          ...prev,
          [ticketTypeId]: {
            ...prev[ticketTypeId],
            quantity,
            sectionId,
            seatIds: [],    // hoặc undefined cũng được
            name: seat.label
          },
        };
      } else {
        // Dạng chọn ghế bình thường (SELECT_SEAT)
        const current = prev[ticketTypeId] || { quantity: 0, seatIds: [] };
        const newQuantity = isSelected ? current.quantity + 1 : Math.max(current.quantity - 1, 0);
        let newSeatIds = current.seatIds || [];
        if (isSelected) {
          newSeatIds = [...newSeatIds, seat.id];
        } else {
          newSeatIds = newSeatIds.filter((id) => id !== seat.id);
        }
        return {
          ...prev,
          [ticketTypeId]: {
            ...current,
            quantity: newQuantity,
            seatIds: newSeatIds,
            name: seat.label
          },
        };
      }
    });

    // update selectedSeatIds chỉ cho SELECT_SEAT
    if (!quantity && !sectionId) {
      setSelectedSeatIds((prev) =>
        isSelected ? [...prev, seat.id] : prev.filter((id) => id !== seat.id)
      );
    }
  };

  return (
    <>
      <div>
        <Navigation title={transWithFallback('chooseTicket', 'Chọn vé')} />
        {(event) ? (
          <TicketInfor
            showingStartTime={startShowTime}
            event={event}
            totalTickets={totalTickets}
            totalAmount={totalAmount}
            hasSelectedTickets={totalTickets > 0}
            selectedTickets={selectedTickets}     // <-- truyền object selectedTickets mới
            ticketType={ticketType}               // <-- truyền array ticketType
            selectedSeatIds={selectedSeatIds}
            showingId={showingId}
            onClearSelection={clearSelection}
            seatMapId={seatMapId}
          />
        ) : (
          <Loading />
        )}
        <div className="showing-seatmap-container flex flex-row justify-center my-4 mx-0">
          {isLoadingSeatmap ? (
            <Loading />
          ) : seatmapError ? (
            <Error />
          ) : isShowingData(seatMapData) ? (
            <SelectTicket
              tickets={
                (seatMapData?.TicketType || [])
                  .slice()
                  .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
                  .map((ticket) => ({
                    id: ticket.id,
                    name: ticket.name,
                    price: ticket.price,
                    available: ticket.status !== "sold_out",
                    description: ticket.description,
                    position: ticket.position,
                    minQtyPerOrder: ticket.minQtyPerOrder,
                    maxQtyPerOrder: ticket.maxQtyPerOrder
                  }))
              }
              selectedTickets={selectedTickets}
              setSelectedTickets={setSelectedTickets}
              selectedTicket={selectedTicket}
              setSelectedTicket={setSelectedTicket}
            />
          ) : seatmapType === SeatmapType.SELECT_SEAT ? (
            <>
              <SeatMapComponent
                seatMap={seatMapData as SeatMap}
                onSeatSelectionChange={handleSeatSelectionChange}
                ticketType={ticketType}
                selectedSeatIds={selectedSeatIds}
              />
              <div className='w-[30%] pl-4'>
                {ticketType.length > 0 && (
                  <div className='ticket-type-list'>
                    <h2 className='font-bold text-lg mb-2'>{t("ticketPrice") ?? "Giá vé"}</h2>
                    {ticketType.map((type) => (
                      <div key={type.id} className='ticket-type-item flex justify-between items-center mb-2'>
                        <div className='flex items-center'>
                          <span
                            className="inline-block ticket-type-color w-10 h-6 rounded mr-2"
                            style={{ backgroundColor: type.color.replace(/"/g, '') }}
                          ></span>
                          <span className='ticket-type-name'>{type.name}</span>
                        </div>
                        <span className='ticket-type-price text-[#0C4762] font-semibold'>{type.price?.toLocaleString("vi-VN")}đ</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) :
            (
              <>
                <SeatMapSectionComponent
                  seatMap={seatMapData as SeatMap}
                  onSeatSelectionChange={handleSeatSelectionChange}
                  ticketType={ticketType}
                  selectedTickets={selectedTickets}
                />
                <div className='w-[30%] pl-4'>
                  {ticketType.length > 0 && (
                    <div className='ticket-type-list'>
                      <h2 className='font-bold text-lg mb-2'>{t("ticketPrice") ?? "Giá vé"}</h2>
                      {ticketType.map((type) => (
                        <div key={type.id} className='ticket-type-item flex justify-between items-center mb-2'>
                          <div className='flex items-center'>
                            <span
                              className="inline-block ticket-type-color w-10 h-6 rounded mr-2"
                              style={{ backgroundColor: type.color }}
                            ></span>
                            <span className='ticket-type-name'>{type.name}</span>
                          </div>
                          <span className='ticket-type-price text-[#0C4762] font-semibold'>{type.price?.toLocaleString("vi-VN")}đ</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
        </div>
      </div>
      <AlertDialog
        message={alertMessage}
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
        {...href ? { href } : {}}
      />
    </>
  );
}