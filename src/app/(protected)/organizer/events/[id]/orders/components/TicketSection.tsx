'use client';

import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { getAllTicketsOfShowing } from '@/services/org.service'; // import your fetch method
import { OrderTicket } from '@/types/models/org/orders.interface'; // assume you have these
import { toast } from 'react-toastify';
import Pagination from '../../check-in/components/common/pagination';

interface TicketSectionProps {
  showingId: string;
}

export default function TicketSection({ showingId }: TicketSectionProps) {
  const t = useTranslations('common');
  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    return msg.startsWith('common.') ? fallback : msg;
  };

  const [search, setSearch] = useState('');
  const [tickets, setTickets] = useState<OrderTicket[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
const [totalItems, setTotalItems] = useState(0);
const itemsPerPage = 10;

  const fetchTickets = async (orderId?: number, page?: number) => {
    try {
      setLoading(true);
      const response = await getAllTicketsOfShowing(showingId, orderId, page);
      setTotalItems(response.data[1]? response.data[1].totalItems: response.data[0].length);
      setTickets(response.data[0] || []);
    } catch (err) {
      toast.error('Lỗi khi tải dữ liệu vé');
      console.error('Error loading tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showingId) {
      fetchTickets();
    }
  }, [showingId]);

  useEffect(() => {
  if (showingId) {
    const orderId = Number(search.trim());
    if (!isNaN(orderId) && orderId > 0) {
      fetchTickets(orderId, page);
    } else {
      fetchTickets(undefined, page);
    }
  }
}, [showingId, page]);

  if (loading) {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#0C4762]" />
    </div>
  );
}
const handleSearch = () => {
  const trimmed = search.trim();
  const orderId = Number(trimmed);
  setPage(1); // reset to page 1 on search

  if (trimmed === '') {
    fetchTickets(undefined, 1);
  } else if (!isNaN(orderId)) {
    fetchTickets(orderId, 1);
  } else {
    toast.error("Vui lòng nhập mã đơn hàng hợp lệ!");
  }
};
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex justify-between items-center pt-6">
        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden w-1/3 bg-white">
          <input
  type="text"
  className="w-full px-3 py-2 outline-none"
  placeholder={transWithFallback('searchByOrderId', 'Tìm kiếm theo mã đơn hàng')}
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === 'Enter') handleSearch(); // Optional: press Enter to search
  }}
/>
<button
  onClick={handleSearch}
  className="bg-[#51DACF] px-3 py-2 border-l border-gray-300 transition duration-200 hover:bg-[#3AB5A3]"
>
  <Search size={24} color="white" />
</button>
        </div>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-[#0C4762] text-white text-left">
            <th className="py-2 px-4">{transWithFallback("ticketId", "Mã vé")}</th>
            <th className="py-2 px-4">{transWithFallback("customer", "Khách hàng")}</th>
            <th className="py-2 px-4">{transWithFallback("ticketType", "Loại vé")}</th>
            <th className="py-2 px-4">{transWithFallback("orderId", "Mã đơn hàng")}</th>
            <th className="py-2 px-4">{transWithFallback("status", "Trạng thái")}</th>
          </tr>
        </thead>
        <tbody>
          {tickets.length > 0 ? (
            tickets.map((ticket) => (
              <tr key={`ticket-${ticket.id}`} className="border-t hover:bg-gray-50">
                <td className="py-2 px-4">{ticket.id}</td>
                <td className="py-2 px-4">{ticket.Order.userId}</td>
                <td className="py-2 px-4">{ticket.Order.type}</td>
                <td className="py-2 px-4">{ticket.orderId}</td>
                <td className="py-2 px-4">
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      ticket.Order.status === 'SUCCESS'
                        ? 'bg-green-100 text-green-800'
                        : ticket.Order.status !== 'SUCCESS'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {ticket.Order.status === 'SUCCESS'
                      ? 'Hoàn thành'
                      : ticket.Order.status !== 'SUCCESS'
                      ? 'Đang xử lý'
                      : 'Đã hủy'}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center py-4 text-gray-500">
                Không tìm thấy vé phù hợp.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {tickets.length > 0 && (
  <Pagination
    currentPage={page}
    totalItems={totalItems}
    itemsPerPage={itemsPerPage}
    onPrevious={() => setPage((prev) => Math.max(prev - 1, 1))}
    onNext={() => setPage((prev) => prev + 1)}
  />
)}
    </div>
  );
}
