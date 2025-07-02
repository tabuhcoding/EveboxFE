'use client';

/* Package System */
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

/* Package Application */
import { TicketTableProps } from "@/types/models/admin/showingManagement.interface";
import { formatCurrency } from "@/utils/helpers";

export default function TicketTable({ showingID, ticketTypes }: TicketTableProps) {
  const t = useTranslations('common');
  const router = useRouter();

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
    <div className="table-ticket px-8 mb-10">
      <div className="overflow-x-auto rounded-xl shadow-md mt-3">
        <table className="min-w-full border border-gray-200">
          <thead>
            <tr className="bg-[#0C4762] text-center text-white text-xs rounded-t-lg">
              <th className="px-4 py-3 cursor-pointer">
                ID
              </th>
              <th className="px-4 py-3 cursor-pointer min-w-[120px]">
                {transWithFallback('ticketName', 'Tên vé')}
              </th>
              <th className="px-4 py-3 cursor-pointer">
                {transWithFallback('description', 'Mô tả')}
              </th>
              <th className="px-4 py-3 cursor-pointer">
               {transWithFallback('ticketPrice', 'Giá vé')}
              </th>
              <th className="px-4 py-3 cursor-pointer min-w-[90px]">
                {transWithFallback('ticketQuantity', 'Số lượng vé')}
              </th>
              <th className="px-4 py-3 cursor-pointer min-w-[90px]">
                {transWithFallback('soldTickets', 'Số vé đã bán')}
              </th>
              <th className="px-4 py-3 cursor-pointer min-w-[90px]">{transWithFallback('status', 'Trạng thái')}</th>
            </tr>
          </thead>
          <tbody className="text-xs">
            {ticketTypes.map((ticket, index) => (
              <tr key={ticket.id ?? index} className="border-t border-gray-200 hover:bg-gray-200 transition-colors duration-200"
                onClick={() => router.push(`/admin/showing-management/${showingID}/ticket/${ticket.id}`)}>
                <td className="px-4 py-3 text-center border-r border-gray-200">{ticket.id}</td>
                <td className="px-4 py-3 border-r border-gray-200 cursor-pointer max-w-[200px] align-middle">
                  <div className="line-clamp-2 leading-snug">
                    {ticket.name}
                  </div>
                </td>
                <td className="px-4 py-3 border-r border-gray-200 cursor-pointer max-w-[200px] align-middle">
                  <div className="line-clamp-3 leading-snug">
                    <span>
                      {`${new Date(ticket.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })} - ${new Date(ticket.endTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })} ${new Date(ticket.startTime).toLocaleDateString('vi-VN')}`}
                    </span>
                    <br></br>{ticket.description}
                  </div>
                </td>
                <td className="text-center px-4 py-3 border-r border-gray-200 cursor-pointer max-w-[200px] align-middle">
                  {(ticket.price === 0 || ticket.isFree === true) ? transWithFallback('free', 'Miễn phí') : `${formatCurrency(ticket.price)} VNĐ`}
                </td>
                <td className="px-4 py-3 text-center border-r border-gray-200">
                  {ticket.quantity}
                </td>
                <td className="px-4 py-3 border-r border-gray-200 text-center cursor-pointer">
                  {ticket.sold}
                </td>
                <td className="action-btn px-4 py-3 border-r border-gray-200 text-center">
                  {renderTicketStatus(ticket.status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}