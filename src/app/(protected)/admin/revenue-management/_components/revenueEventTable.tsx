'use client';

/* Package System */
import { Fragment } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, ChevronRight } from "lucide-react";

/* Package Application */
import { EventRevenueTableProps } from "@/types/models/admin/revenueManagement.interface";

export default function EventRevenueTable({
  loading,
  events,
  orgId,
  toggleEvent,
  toggleEventDetail,
  formatCurrency,
  className = "",
}: EventRevenueTableProps) {
  const t = useTranslations("common");

  function formatDateRange(start: string, end: string): string {
    const startDate = new Date(start);
    const endDate = new Date(end);

    const dateFormatter = new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });

    const timeFormatter = new Intl.DateTimeFormat("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });

    const datePart = dateFormatter.format(startDate);
    const startTime = timeFormatter.format(startDate);
    const endTime = timeFormatter.format(endDate);

    return `${datePart} ${startTime} - ${endTime}`;
  }

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    if (!msg || msg.startsWith('common.')) return fallback;
    return msg;
  }

  if (loading) {
    return (
      <div className="flex-1 p-6 md-64 w-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0C4762] mx-auto"></div>
          <p className="mt-4 text-[#0C4762]">{transWithFallback("loadingData", "Đang tải dữ liệu...")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#0C4762] text-white">
              <th className="py-2 px-4 text-left w-16">{transWithFallback('noStt', 'STT')}</th>
              <th className="py-2 px-4 text-left">{transWithFallback('eventName', 'Tên sự kiện')}</th>
              <th className="py-2 px-4 text-left">{transWithFallback('totalRevenue', 'Tổng doanh thu')}</th>
              <th className="py-2 px-4 text-left">{transWithFallback('discount', 'Chiết khấu')}</th>
              <th className="py-2 px-4 text-left">{transWithFallback('actualRevenue', 'Doanh thu thực nhận')}</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, index) => (
              <Fragment key={`event-${orgId}-${event.id}`}>
                <tr className="cursor-pointer hover:bg-[#E3FEF7]" onClick={() => toggleEvent(orgId, event.id)}>
                  <td className="py-2 px-4 border-t flex items-center">
                    {event.showings.length > 0 && (
                      <>
                        {event.isExpanded ? (
                          <ChevronDown className="w-4 h-4 mr-1" />
                        ) : (
                          <ChevronRight className="w-4 h-4 mr-1" />
                        )}
                      </>
                    )}
                    {index + 1}
                  </td>
                  <td className="py-2 px-4 border-t">{event.name}</td>
                  <td className="py-2 px-4 border-t">{formatCurrency(event.totalRevenue)}</td>
                  <td className="py-2 px-4 border-t">{event.platformFee}%</td>
                  <td className="py-2 px-4 border-t">{formatCurrency(event.actualRevenue)}</td>
                </tr>

                {event.isExpanded &&
                  event.showings.map((showing) => (
                    <Fragment key={`showing-${showing.showingId}`}>
                      <tr
                        className="bg-gray-50 cursor-pointer hover:bg-[#f0fdfa]"
                        onClick={() => toggleEventDetail(orgId, event.id, showing.showingId)}
                      >
                        <td className="py-2 px-6 border-t"></td>
                        <td className="py-2 px-4 border-t" colSpan={2}>
                          {formatDateRange(showing.startDate, showing.endDate)}
                        </td>
                        <td className="py-2 px-4 border-t" colSpan={2}>
                          {formatCurrency(showing.revenue)}
                        </td>
                      </tr>

                      {showing.isExpanded && (
                        <>
                          <tr className="bg-gray-100 text-sm text-gray-700">
                            <td></td>
                            <td className="px-6 py-1 font-medium">{transWithFallback('ticketType', 'Loại vé')}</td>
                            <td className="px-4 py-1 font-medium">{transWithFallback('ticketPrice', 'Giá')}</td>
                            <td className="px-4 py-1 font-medium">{transWithFallback('quantity', 'Số lượng')}</td>
                            <td className="px-4 py-1 font-medium">{transWithFallback('revenue', 'Doanh thu')}</td>
                          </tr>
                          {showing.ticketTypes.map((ticket) => (
                            <tr key={`ticket-${ticket.ticketTypeId}`} className="bg-gray-50 text-gray-800 text-sm">
                              <td></td>
                              <td className="px-6 py-1">{ticket.name}</td>
                              <td className="px-4 py-1">{formatCurrency(ticket.price)}</td>
                              <td className="px-4 py-1">{ticket.sold}</td>
                              <td className="px-4 py-1">{formatCurrency(ticket.revenue)}</td>
                            </tr>
                          ))}
                        </>
                      )}
                    </Fragment>
                  ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
