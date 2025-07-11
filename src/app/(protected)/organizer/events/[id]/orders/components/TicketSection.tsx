'use client';

import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { getAllTicketsOfShowing } from '@/services/org.service'; // import your fetch method
import { OrderTicket } from '@/types/models/org/orders.interface'; // assume you have these
import { toast } from 'react-toastify';

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

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const response = await getAllTicketsOfShowing(showingId);
        setTickets(response.data || []);
      } catch (err) {
        toast.error('Lỗi khi tải dữ liệu vé');
        console.error('Error loading tickets:', err);
      } finally {
        setLoading(false);
      }
    };

    if (showingId) {
      fetchTickets();
    }
  }, [showingId]);

  const filteredTickets = tickets.filter((ticket) => {
    const formResponses = ticket.formResponse?.FormAnswer || [];
    const nameField = formResponses.find((answer) => {
      const fieldName = answer.FormInput?.fieldName?.toLowerCase() || '';
      return fieldName.includes('name') || fieldName.includes('tên');
    });

    const name = nameField?.value || '';
    return name.toLowerCase().includes(search.toLowerCase()) || ticket.id.toLowerCase().includes(search.toLowerCase());
  });

  const getCustomerName = (ticket: OrderTicket): string => {
    const formResponses = ticket.formResponse?.FormAnswer || [];
    const nameField = formResponses.find((answer) => {
      const fieldName = answer.FormInput?.fieldName?.toLowerCase() || '';
      return fieldName.includes('name') || fieldName.includes('tên');
    });

    return nameField?.value || '-';
  };

  const getCustomerEmail = (ticket: OrderTicket): string => {
    const formResponses = ticket.formResponse?.FormAnswer || [];
    const emailField = formResponses.find((answer) => {
      const fieldName = answer.FormInput?.fieldName?.toLowerCase() || '';
      return fieldName.includes('email');
    });

    return emailField?.value || '-';
  };

  if (loading) {
    return <p className="text-center py-6">Đang tải dữ liệu vé...</p>;
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex justify-between items-center pt-6">
        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden w-1/3 bg-white">
          <input
            type="text"
            className="w-full px-3 py-2 outline-none"
            placeholder={transWithFallback('searchByName', 'Tìm kiếm theo tên')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="bg-[#51DACF] px-3 py-2 border-l border-gray-300 transition duration-200 hover:bg-[#3AB5A3]">
            <Search size={24} color="white" />
          </button>
        </div>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-[#0C4762] text-white text-left">
            <th className="py-2 px-4">Mã vé</th>
            <th className="py-2 px-4">Khách hàng</th>
            <th className="py-2 px-4">Email</th>
            <th className="py-2 px-4">Loại vé</th>
            <th className="py-2 px-4">Trạng thái</th>
            <th className="py-2 px-4">Email đã gửi</th>
          </tr>
        </thead>
        <tbody>
          {filteredTickets.length > 0 ? (
            filteredTickets.map((ticket) => (
              <tr key={ticket.id} className="border-t hover:bg-gray-50">
                <td className="py-2 px-4">{ticket.id}</td>
                <td className="py-2 px-4">{getCustomerName(ticket)}</td>
                <td className="py-2 px-4">{getCustomerEmail(ticket)}</td>
                <td className="py-2 px-4">{ticket.type}</td>
                <td className="py-2 px-4">
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      ticket.status === 'PAID'
                        ? 'bg-green-100 text-green-800'
                        : ticket.status !== 'PAID'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {ticket.status === 'PAID'
                      ? 'Hoàn thành'
                      : ticket.status !== 'PAID'
                      ? 'Đang xử lý'
                      : 'Đã hủy'}
                  </span>
                </td>
                <td className="py-2 px-4">
                  {ticket.mailSent ? (
                    <span className="px-2 py-1 rounded-full text-sm bg-green-100 text-green-800">Đã gửi</span>
                  ) : (
                    <span className="px-2 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">Chưa gửi</span>
                  )}
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
    </div>
  );
}
