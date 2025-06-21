'use client';

/* Package System */
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

/* Package Application */
import createApiClient from '@/services/apiClient';
import { IGetUserTicketResponse, IUserTicket } from '@/types/models/ticket/ticketInfo';

const apiClient = createApiClient(process.env.NEXT_PUBLIC_API_URL || "");

const TicketManagement = () => {
  const [successTickets, setSuccessTickets] = useState<IUserTicket[]>([]);
  const [pendingTickets, setPendingTickets] = useState<IUserTicket[]>([]);
  const [cancelledTickets, setCancelledTickets] = useState<IUserTicket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [selectedSubTab, setSelectedSubTab] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);

  const router = useRouter();

  const t = useTranslations('common');

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    if (!msg || msg.startsWith('common.')) return fallback;
    return msg;
  };

  //Pagination
  const [pagination, setPagination] = useState({
    SUCCESS: { page: 1, totalPages: 0 },
    PENDING: { page: 1, totalPages: 0 },
    CANCELLED: { page: 1, totalPages: 0 }
  });

  const fetchTicketsByStatus = async (status: string, page = 1): Promise<IUserTicket[]> => {
    const response = await apiClient.get<IGetUserTicketResponse>(
      `/api/ticket/getUserOrder?page=${page}&limit=10&status=${status}`
    );

    setPagination(prev => ({
      ...prev,
      [status]: {
        page,
        totalPages: response.data.pagination.totalPages,
      }
    }));

    return response.data.data;
  };
  const handlePageChange = async (status: string, newPage: number) => {
    try {
      const tickets = await fetchTicketsByStatus(status, newPage);
      if (status === 'SUCCESS') setSuccessTickets(tickets);
      if (status === 'PENDING') setPendingTickets(tickets);
      if (status === 'CANCELLED') setCancelledTickets(tickets);
    } catch (err) {
      console.error("Error changing page", err);
    }
  };

  const currentStatus = selectedTab === 1 ? 'SUCCESS' :
    selectedTab === 2 ? 'PENDING' :
      selectedTab === 3 ? 'CANCELLED' : null;

  const renderPagination = () => {
    if (!currentStatus) return null;
    const { page, totalPages } = pagination[currentStatus];
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center mt-6 gap-4">
        <button
          onClick={() => handlePageChange(currentStatus, page - 1)}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Trang trước
        </button>
        <span className="px-4 py-2 font-bold">{page} / {totalPages}</span>
        <button
          onClick={() => handlePageChange(currentStatus, page + 1)}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Trang sau
        </button>
      </div>
    );
  };

  const fetchAllPagesByStatus = async (status: string): Promise<IUserTicket[]> => {
    const firstPageResponse = await apiClient.get<IGetUserTicketResponse>(
      `/api/ticket/getUserOrder?page=1&limit=10&status=${status}`
    );

    const totalPages = firstPageResponse.data.pagination.totalPages;
    const allTickets = [...firstPageResponse.data.data];

    // Nếu có nhiều hơn 1 trang thì gọi tiếp
    if (totalPages > 1) {
      const requests = [];
      for (let page = 2; page <= totalPages; page++) {
        requests.push(
          apiClient.get<IGetUserTicketResponse>(
            `/api/ticket/getUserOrder?page=${page}&limit=10&status=${status}`
          )
        );
      }

      const responses = await Promise.all(requests);
      responses.forEach(res => {
        allTickets.push(...res.data.data);
      });
    }

    return allTickets;
  };

  useEffect(() => {
    setCurrentTime(Date.now());

    const fetchAllTickets = async () => {
      try {
        const [success, pending, cancelled] = await Promise.all([
          fetchAllPagesByStatus("SUCCESS"),
          fetchAllPagesByStatus("PENDING"),
          fetchAllPagesByStatus("CANCELLED")
        ]);
        setSuccessTickets(success);
        setPendingTickets(pending);
        setCancelledTickets(cancelled);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllTickets();
  }, []);


  const getAllTickets = (): IUserTicket[] => {
    return [...successTickets, ...pendingTickets, ...cancelledTickets];
  };

  const getTicketsByTab = (): IUserTicket[] => {
    switch (selectedTab) {
      case 1: return successTickets;
      case 2: return pendingTickets;
      case 3: return cancelledTickets;
      default: return getAllTickets();
    }
  };

  const filteredTickets = getTicketsByTab().filter(ticket => {
    const eventTime = ticket.Showing?.startTime ? new Date(ticket.Showing.startTime).getTime() : 0;
    const timeFilter = selectedSubTab === 0 ? eventTime >= currentTime : eventTime < currentTime;
    return timeFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return 'bg-green-500 text-black';
      case 'PENDING':
        return 'bg-yellow-500 text-white';
      case 'CANCELLED':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="ticket-management mt-2 mx-auto px-4">
      <h2 className="text-2xl font-bold mt-8 mb-4">{transWithFallback('managementTicket', 'Quản lý vé đã mua')}</h2>
      <h5 className="text-sm text-gray-700">{transWithFallback('managementTicketSubtitle', 'Quản lý tiến trình tham gia sự kiện qua các vé')}</h5>
      <hr className="my-6 border-gray-800 font-bold" />

      {/* Tabs */}
      <div className="w-full mb-4 overflow-x-auto">
        <div className="flex min-w-max sm:min-w-full justify-between gap-4 sm:gap-8 md:gap-12 lg:gap-20">
          {[transWithFallback('allTab', 'Tất cả'), transWithFallback('successTitle', 'Thành công'), transWithFallback('processingTab', 'Đang xử lý'), transWithFallback('canceledTab', 'Đã hủy')].map((tab, index) => (
            <button
              key={index}
              className={`flex-1 text-center whitespace-nowrap px-6 py-2 rounded-full ${selectedTab === index ? 'bg-[#51DACF] text-black font-bold' : 'bg-gray-300 text-gray-700'}`}
              onClick={() => setSelectedTab(index)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex justify-center mb-4">
        <div className="flex w-full max-w-md justify-between">
          {[transWithFallback('upcomingTab', 'Sắp diễn ra'), transWithFallback('showingOver', 'Đã kết thúc')].map((subTab, index) => (
            <button
              key={index}
              className={`relative px-10 py-2 font-medium ${selectedSubTab === index ? 'text-black font-bold' : 'text-gray-700'}`}
              onClick={() => setSelectedSubTab(index)}
            >
              {subTab}
              <div className={`absolute rounded-full bottom-0 left-0 w-full h-1 ${selectedSubTab === index ? 'bg-[#51DACF]' : 'bg-transparent'}`} />
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-center mb-8">{transWithFallback('loadingData', 'Đang tải dữ liệu...')}</p>
      ) : filteredTickets.length === 0 ? (
        <p className="text-center mb-8">{transWithFallback('noTickets', 'Bạn chưa có vé nào.')}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 mb-10">
          {filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              className="flex border rounded-lg shadow-md overflow-hidden bg-[#0C4762] text-white"
              onClick={() => router.push(`/my-ticket/${ticket.id}`)}
            >
              {/* Ngày tháng */}
              <div className="bg-[#08374A] text-white p-4 flex flex-col items-center justify-center w-26 border-r border-white">
                <span className="text-2xl font-bold">
                  {ticket.Showing?.startTime
                    ? new Date(ticket.Showing.startTime).getDate()
                    : "--"}
                </span>
                <span className="text-sm uppercase">
                  {ticket.Showing?.startTime
                    ? new Date(ticket.Showing.startTime).toLocaleString("vi-VN", {
                      month: "long",
                    })
                    : "---"}
                </span>
                <span className="text-sm">
                  {ticket.Showing?.startTime
                    ? new Date(ticket.Showing.startTime).getFullYear()
                    : "----"}
                </span>
              </div>
              {/* Thông tin sự kiện */}
              <div className="flex-1 p-4">
                <h3 className="text-lg font-semibold mb-2">
                  {ticket.Showing?.title}
                </h3>
                <div className="flex gap-2 mb-2">
                  <span className={`${getStatusColor(ticket.status)} text-xs px-2 py-1 rounded-md`}>
                    {ticket.status === 'SUCCESS' ? "Thành công" : ticket.status === 'PENDING' ? "Đang xử lý" : ticket.status === 'CANCELLED' ? "Đã hủy" : ""}
                  </span>
                  <span className={`border border-green-500 text-green-500 text-xs px-2 py-1 rounded-md`}>
                    {ticket.type === 'E_TICKET' ? "Vé điện tử" : "Vé cứng"}
                  </span>
                </div>
                <p className="text-sm font-medium">
                  🕒 {ticket.Showing?.startTime
                    ? new Date(ticket.Showing.startTime).toLocaleString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    }).replace("lúc ", "")
                    : transWithFallback('noInformation', 'Chưa có thông tin')}
                </p>
                <p className="text-sm font-medium">
                  📍 {ticket.Showing?.locationsString || transWithFallback('locationString', 'Địa điểm chưa cập nhật')}
                </p>
              </div>
            </div>
          ))}
          {renderPagination()}

        </div>
      )}
    </div>
  );
};

export default TicketManagement;
