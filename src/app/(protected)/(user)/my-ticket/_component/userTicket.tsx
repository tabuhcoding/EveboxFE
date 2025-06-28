'use client';

/* Package System */
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

/* Package Application */
import { IUserTicket } from '@/types/models/ticket/ticketInfo';
import TicketPagination from './ticketPagination';
import { getUserTicketResponse } from '@/services/booking.service';

export default function TicketManagement() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('common');

  const [selectedTab, setSelectedTab] = useState(Number(searchParams.get('tab')) || 0); // 0: All, 1: Success, 2: Pending, 3: Cancelled
  const [selectedSubTab, setSelectedSubTab] = useState(Number(searchParams.get('subtab')) || 0);
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);
  const [ticketsPerPage, setTicketsPerPage] = useState(Number(searchParams.get('limit')) || 10);
  const [searchKeyword, setSearchKeyword] = useState(searchParams.get('q') || '');

  const [successTickets, setSuccessTickets] = useState<IUserTicket[]>([]);
  const [pendingTickets, setPendingTickets] = useState<IUserTicket[]>([]);
  const [cancelledTickets, setCancelledTickets] = useState<IUserTicket[]>([]);
  const [allTickets, setAllTickets] = useState<IUserTicket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState<number>(1);

  function setUrlParams({
    page = currentPage,
    tab = selectedTab,
    subtab = selectedSubTab,
    limit = ticketsPerPage,
    q = searchKeyword
  }: {
    page?: number, tab?: number, subtab?: number, limit?: number, q?: string
  }) {
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('tab', String(tab));
    params.set('subtab', String(subtab));
    params.set('limit', String(limit));
    if (q) params.set('q', q);
    router.replace(`?${params.toString()}`, { scroll: false });
  }

  const fetchTicketsByPage = async (
    page = currentPage,
    status?: string,
    limit = ticketsPerPage,
    keyword = searchKeyword,
    subTabParam = selectedSubTab
  ) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      params.append('timeStamp', subTabParam === 0 ? 'UPCOMING' : 'PAST');
      if (status) params.append('status', status);
      if (keyword) params.append('title', keyword);

      const token = session?.user?.accessToken || "";

      const url = `/api/ticket/getUserOrder?${params.toString()}`;
      const response = await getUserTicketResponse(url, token);

      if (response?.statusCode === 200) {
        const fetchedTickets = response.data;
        const totalPageCount = response.pagination.totalPages;

        if (!status) setAllTickets(fetchedTickets);
        if (status === 'SUCCESS') setSuccessTickets(fetchedTickets);
        if (status === 'PENDING') setPendingTickets(fetchedTickets);
        if (status === 'CANCELLED') setCancelledTickets(fetchedTickets);

        setTotalPages(totalPageCount);
      } else {
        setAllTickets([]);
        setSuccessTickets([]);
        setPendingTickets([]);
        setCancelledTickets([]);
      }
    } catch (error) {
      console.error("🚀 ~ TicketManagement ~ error:", error)
      setAllTickets([]);
      setSuccessTickets([]);
      setPendingTickets([]);
      setCancelledTickets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicketsByPage(currentPage, tabToStatus(selectedTab), ticketsPerPage, searchKeyword, selectedSubTab);
  }, []);

  const tabToStatus = (tab: number) => {
    if (tab === 1) return 'SUCCESS';
    if (tab === 2) return 'PENDING';
    if (tab === 3) return 'CANCELLED';
    return undefined;
  };

  const handleTabChange = (index: number) => {
    setSelectedTab(index);
    setSelectedSubTab(0);
    setCurrentPage(1);
    setUrlParams({ tab: index, subtab: 0, page: 1 });
    fetchTicketsByPage(1, tabToStatus(index), ticketsPerPage, searchKeyword, 0);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setUrlParams({ page });
    fetchTicketsByPage(page, tabToStatus(selectedTab), ticketsPerPage, searchKeyword, selectedSubTab);
  };

  const handleSubTabChange = (index: number) => {
    setSelectedSubTab(index);
    setCurrentPage(1);
    setUrlParams({ subtab: index, page: 1 });
    fetchTicketsByPage(1, tabToStatus(selectedTab), ticketsPerPage, searchKeyword, index);
  };

  const handleTicketsPerPageChange = (num: number) => {
    setTicketsPerPage(num);
    setCurrentPage(1);
    setUrlParams({ limit: num, page: 1 });
    fetchTicketsByPage(1, tabToStatus(selectedTab), num, searchKeyword, selectedSubTab);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    setUrlParams({ q: searchKeyword, page: 1 });
    fetchTicketsByPage(1, tabToStatus(selectedTab), ticketsPerPage, searchKeyword, selectedSubTab);
  };

  const getTicketsByTab = (): IUserTicket[] => {
    switch (selectedTab) {
      case 1: return successTickets;
      case 2: return pendingTickets;
      case 3: return cancelledTickets;
      default: return allTickets;
    }
  };

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

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    return !msg || msg.startsWith('common.') ? fallback : msg;
  };

  return (
    <>
      <div className="ticket-management mt-2 mx-auto px-4">
        <h2 className="text-2xl font-bold mt-8 mb-4">{transWithFallback('managementTicket', 'Quản lý vé đã mua')}</h2>
        <h5 className="text-sm text-gray-700">{transWithFallback('managementTicketSubtitle', 'Quản lý tiến trình tham gia sự kiện qua các vé')}</h5>
        <hr className="my-6 border-gray-800 font-bold" />

        <div className="flex items-center my-4 gap-4 flex-col sm:flex-row">
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
            placeholder={transWithFallback('searchPlaceholder', 'Tìm theo tên sự kiện hoặc nhà tổ chức')}
            className="w-full sm:max-w-md px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#51DACF]"
          />
          <button
            onClick={handleSearch}
            className="bg-[#51DACF] text-black font-bold px-4 py-2 rounded"
          >
            {transWithFallback('searchButton', 'Tìm kiếm')}
          </button>
        </div>

        {/* Tabs */}
        <div className="w-full mb-4 overflow-x-auto">
          <div className="flex min-w-max sm:min-w-full justify-between gap-4 sm:gap-8 md:gap-12 lg:gap-20">
            {[transWithFallback('allTab', 'Tất cả'), transWithFallback('successTitle', 'Thành công'), transWithFallback('processingTab', 'Đang xử lý'), transWithFallback('canceledTab', 'Đã hủy')].map((tab, index) => (
              <button
                key={index}
                className={`flex-1 text-center whitespace-nowrap px-6 py-2 rounded-full ${selectedTab === index ? 'bg-[#51DACF] text-black font-bold' : 'bg-gray-300 text-gray-700'}`}
                onClick={() => handleTabChange(index)}
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
                onClick={() => handleSubTabChange(index)}
              >
                {subTab}
                <div className={`absolute rounded-full bottom-0 left-0 w-full h-1 ${selectedSubTab === index ? 'bg-[#51DACF]' : 'bg-transparent'}`} />
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p className="text-center mb-8">{transWithFallback('loadingData', 'Đang tải dữ liệu...')}</p>
        ) : getTicketsByTab().length === 0 ? (
          <p className="text-center mb-8">{transWithFallback('noTickets', 'Bạn chưa có vé nào.')}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 mb-10">
            {getTicketsByTab().map(ticket => (
              <div
                key={ticket.id}
                className="flex border rounded-lg shadow-md overflow-hidden bg-[#0C4762] text-white cursor-pointer transform transition duration-200 hover:scale-105 hover:bg-[#125b7e] active:scale-95"
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
                      ? new Date(ticket.Showing.startTime).toLocaleString("vi-VN", { month: "long" })
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
          </div>
        )}
      </div>
      <TicketPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        ticketsPerPage={ticketsPerPage}
        setTicketsPerPage={handleTicketsPerPageChange}
      />
    </>
  );
}
