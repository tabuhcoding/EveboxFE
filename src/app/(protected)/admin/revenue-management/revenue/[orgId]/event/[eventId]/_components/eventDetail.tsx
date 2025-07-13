'use client';

/* Package System */
import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ChevronDown, RefreshCw } from "lucide-react";

/* Package Application */
import { useAuth } from "@/contexts/auth.context";
import { OverviewCard } from "@/app/(protected)/organizer/events/[id]/summary-revenue/components/overviewCard";
import { getEventRevenueDetail } from "@/services/event.service";

type TicketType = {
  id: number
  type: string
  price: number
  sold: number
  locked: number
  total: number
  revenue: number
}

type Showing = {
  id: string
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  revenue: number
  totalTickets: number
  soldTickets: number
  ticketTypes: TicketType[]
  percentageSold: number
}

type Event = {
  id: number
  name: string
  organizerId: string
  organizerName: string
  location: string
  address: string
  showings: Showing[]
}

type EventOption = { id: number; name: string; organizerId: string }

export default function EventDetailPage({ eventId }: { eventId: string }) {
  const t = useTranslations('common');
  const { session } = useAuth();

  const [event, setEvent] = useState<Event | null>(null);
  const [selectedShowingId, setSelectedShowingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState(event?.name)
  const [orgId, setOrgId] = useState("");

  useEffect(() => {
    const fetchRevenueDetail = async () => {
      try {
        const eventData = localStorage.getItem("selectedEvent");
        const parsedEvent = eventData ? JSON.parse(eventData) : null;

        const response = await getEventRevenueDetail(parsedEvent.organizerId, Number(eventId), session?.user?.accessToken || "");

        if (response?.statusCode !== 200) {
          setEvent(null);
        }

        const showings = response.data.map((s): Showing => ({
          id: s.showingId,
          startDate: new Date(s.startTime).toLocaleDateString("vi-VN"),
          endDate: new Date(s.endTime).toLocaleDateString("vi-VN"),
          startTime: new Date(s.startTime).toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          endTime: new Date(s.endTime).toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          revenue: s.revenue,
          totalTickets: 0,      // Placeholder
          soldTickets: 0,       // Placeholder
          percentageSold: 0,    // Placeholder
          ticketTypes: [],      // Placeholder
        }));

        const mappedEvent: Event = {
          id: parsedEvent.id,
          name: parsedEvent.name,
          organizerId: parsedEvent.organizerId,
          organizerName: parsedEvent.organizerName,
          location: parsedEvent.location ?? "Không rõ",
          address: parsedEvent.address ?? "Không rõ",
          showings,
        };

        setEvent(mappedEvent);
        setSelectedFilter(mappedEvent.name);

      } catch (error) {
        console.error("Failed to load event revenue detail:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRevenueDetail();
  }, [eventId]);

  const selectedShowing = event?.showings.find((s) => s.id === selectedShowingId);

  const [eventOptions, setEventOptions] = useState<EventOption[]>([]);

  useEffect(() => {
    const storedAppRevenue = localStorage.getItem("selectedOrg");
    if (storedAppRevenue) {
      try {
        const parsed = JSON.parse(storedAppRevenue);
        const orgId = parsed.id;
        setOrgId(orgId);
        const eventsWithOrgId = parsed.events.map((event: EventOption) => ({
          ...event,
          organizerId: orgId,
        }));
        setEventOptions(eventsWithOrgId);
      } catch (e) {
        console.error("Invalid appRevenue format", e);
      }
    }
  }, []);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount)
  }

  // Reset filter
  const resetFilter = () => {
    setSelectedFilter(event?.name)
  }

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    return !msg || msg.startsWith('common.') ? fallback : msg;
  };

  if (isLoading) {
    return (
      <div className="flex-1 p-6 md-64 w-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0C4762] mx-auto"></div>
          <p className="mt-4 text-[#0C4762]">{transWithFallback("loadingData", "Đang tải dữ liệu...")}</p>
        </div>
      </div>
    );
  }

  // // Handle row click
  const handleRowClick = (showingId: string) => {
    if (selectedShowingId === showingId) {
      setSelectedShowingId(null) // Toggle off if already selected
    } else {
      setSelectedShowingId(showingId)
      // Simulate loading data for the selected showing
      setIsLoading(true)
      setTimeout(() => {
        setIsLoading(false)
      }, 500)
    }
  }

  return (
    event ? (
      <div className="container p-4 ml-64 pr-28">
        {/* Breadcrumb */}
        <div className="mb-6">
          <div className="flex items-center text-[#0C4762] font-bold text-xl mb-2">
            <Link href={`/admin/revenue-management/revenue/${event.organizerId}`} className="hover:underline">
              {event.organizerName}
            </Link>
            <span className="mx-2">&gt;</span>
            <span>{event.name}</span>
          </div>
          <div className="border-b border-[#0C4762] pb-2">
            <p className="text-gray-600">{transWithFallback('detailRevenueInfoOfEvent', 'Thông tin doanh thu chi tiết của sự kiện')}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center border rounded-md overflow-hidden bg-white">
            <div className="flex items-center px-4 py-2">
              <span className="text-sm">{transWithFallback('chooseEvent', 'Chọn sự kiện')}</span>
            </div>
            <div className="relative border-l">
              <select
                className="appearance-none bg-white px-4 py-2 pr-8 outline-none"
                value={selectedFilter}
                onChange={(e) => {
                  const selectedName = e.target.value;
                  setSelectedFilter(selectedName);

                  const selectedEvent = eventOptions.find((event) => event.name === selectedName);
                  if (selectedEvent) {
                    localStorage.setItem("selectedEvent", JSON.stringify(selectedEvent));
                    window.location.href = `/admin/revenue-management/revenue/${event.organizerId}/event/${selectedEvent.id}`;
                  }
                }}
              >
                {eventOptions.map((event) => (
                  <option key={event.id} value={event.name}>
                    {event.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none" />
            </div>
          </div>

          <button
            onClick={resetFilter}
            className="flex items-center px-4 py-2 text-red-500 border border-red-500 rounded-md bg-white"
          >
            <RefreshCw className="w-4 h-4 mr-1" /> {transWithFallback('resetFilter', 'Đặt lại')}
          </button>
        </div>

        {/* Event Info */}
        <div className="flex flex-wrap gap-3 mb-6">
          <span className="inline-block bg-amber-100 px-3 py-2 rounded-md">
            <span className="font-semibold">{transWithFallback('location', 'Địa điểm')}:</span> {event.location}
          </span>
          <span className="inline-block bg-green-100 px-3 py-2 rounded-md">
            <span className="font-semibold">{transWithFallback('address', 'Địa chỉ')}:</span> {event.address}
          </span>
          <span className="inline-block bg-blue-100 px-3 py-2 rounded-md">
            <span className="font-semibold">{transWithFallback('org', 'Nhà tổ chức')}:</span> {event.organizerName}
          </span>
        </div>

        {/* Showings Table */}
        <div className="overflow-hidden rounded-lg border border-gray-200 shadow mb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#0C4762] text-white">
                <th className="py-2 px-4 text-left w-40">Showing ID</th>
                <th className="py-2 px-4 text-left">{transWithFallback('startDate', 'Ngày bắt đầu')}</th>
                <th className="py-2 px-4 text-left">{transWithFallback('endDate', 'Ngày kết thúc')}</th>
                <th className="py-2 px-4 text-left">{transWithFallback('totalRevenue', 'Tổng doanh thu')}</th>
              </tr>
            </thead>
            <tbody>
              {!event || !event.showings || event.showings.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-2 px-4 text-center text-gray-500 border-t">
                    {transWithFallback('noShowings', 'Không có show nào')}
                  </td>
                </tr>
              ) : (
                event.showings.map((showing) => (
                  <tr
                    key={`showing-${showing.id}`}
                    className={`cursor-pointer hover:bg-[#EAFDFC] ${selectedShowingId === showing.id ? "bg-[#A6F6F1]" : "bg-white"
                      }`}
                    onClick={() => handleRowClick(showing.id)}
                  >
                    <td className="py-2 px-4 border-t">{showing.id}</td>
                    <td className="py-2 px-4 border-t">{showing.startDate}</td>
                    <td className="py-2 px-4 border-t">{showing.endDate}</td>
                    <td className="py-2 px-4 border-t">{formatCurrency(showing.revenue)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Showing Details using reused components */}
        {selectedShowing && (
          <div className="mb-6">
            <hr className="border-gray-300 mb-6" />

            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold">
                Showing: {selectedShowing.startTime}, {selectedShowing.startDate} - {selectedShowing.endTime},{" "}
                {selectedShowing.endDate}
              </h3>
            </div>

            {isLoading ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0C4762] mx-auto"></div>
                <p className="mt-4 text-[#0C4762]">{transWithFallback("loadingData", "Đang tải dữ liệu...")}</p>
              </div>
            ) : (
              <>
                {/* Sử dụng OverviewCard component */}
                <OverviewCard
                  totalRevenue={selectedShowing.revenue}
                  ticketsSold={selectedShowing.soldTickets}
                  totalTickets={selectedShowing.totalTickets}
                  percentageSold={selectedShowing.percentageSold}
                />

                {/* Sử dụng TicketTable component */}
                {/* <TicketTable ticketTypes={selectedShowing.ticketTypes} /> */}
              </>
            )}
          </div>
        )}
      </div>
    ) : (
      <div className="container p-4">
        {/* Breadcrumb */}
        <div className="mb-6">
          <div className="flex items-center text-[#0C4762] font-bold text-xl mb-2">
            <Link href={`/admin/revenue-management/revenue/${orgId}`} className="hover:underline">
              {transWithFallback('revenueManagement', 'Quản lý doanh thu')}
            </Link>
            <span className="mx-2">&gt;</span>
            <span>{transWithFallback('eventDetail', 'Chi tiết sự kiện')}: </span>
          </div>
          <div className="border-b border-[#0C4762] pb-2">
            <p className="text-gray-600">{transWithFallback('detailRevenueInfoOfEvent', 'Thông tin doanh thu sự kiện')}</p>
          </div>
        </div>

        {/* Empty state */}
        <div className="flex flex-col items-center justify-center py-12">
          <div className="bg-red-100 p-6 rounded-full mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {transWithFallback('dataNotFound', 'Không tìm thấy thông tin')}
          </h3>
          <p className="text-gray-600 mb-6 text-center max-w-md">
            {transWithFallback('eventNotFoundDesc', 'Sự kiện bạn đang tìm kiếm không có suất diễn. Vui lòng kiểm tra lại.')}
          </p>
          <Link
            href={`/admin/revenue-management/revenue/${orgId}`}
            className="px-6 py-2 bg-[#0C4762] text-white rounded-md hover:bg-[#0a3a50] transition-colors"
          >
            {transWithFallback('backToRevenue', 'Quay lại quản lý doanh thu')}
          </Link>
        </div>
      </div>
    )
  );
}