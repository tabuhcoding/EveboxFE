'use client';

import { useEffect, useState } from 'react';
import createApiClient from '@/services/apiClient';
import { IGetUserTicketResponse, IUserTicket } from '@/types/models/ticket/ticketInfo';
import { useRouter } from 'next/navigation';

const apiClient = createApiClient(process.env.NEXT_PUBLIC_API_TICKET_SVC_URL || "");

const TicketManagement = () => {
  const [ticketInfo, setTicketInfo] = useState<IUserTicket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [selectedSubTab, setSelectedSubTab] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);

  const router = useRouter();

  useEffect(() => {
    setCurrentTime(Date.now()); // Cập nhật giờ hiện tại khi client render
  }, []);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await apiClient.get<IGetUserTicketResponse>("/api/ticket/getUserTicket");
        setTicketInfo(response.data.data);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const filteredTickets = ticketInfo.filter(ticket => {
    const eventTime = ticket.Showing?.startTime ? new Date(ticket.Showing.startTime).getTime() : 0;
    const statusFilter = selectedTab === 0 || ticket.status === selectedTab;
    const timeFilter = selectedSubTab === 0 ? eventTime >= currentTime : eventTime < currentTime;
    return statusFilter && timeFilter;
  });

  const getStatusColor = (status: number) => {
    switch (status) {
      case 1:
        return 'bg-green-500 text-black';
      case 2:
        return 'bg-yellow-500 text-white';
      case 0:
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await apiClient.get<IGetUserTicketResponse>("/api/ticket/getUserTicket");
        setTicketInfo(response.data.data);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
    console.log(ticketInfo)
  }, [setTicketInfo]);

  return (
    <div className="mt-2 mx-auto px-4">
      <h2 className="text-2xl font-bold mt-8 mb-4">Quản lý vé đã mua</h2>
      <h5 className="text-sm text-gray-700">Quản lý tiến trình tham gia sự kiện qua các vé</h5>
      <hr className="my-6 border-gray-800 font-bold" />

      {/* Tabs */}
      <div className="grid grid-cols-4 gap-20 mb-4">
        {["Tất cả", "Thành công", "Đang xử lý", "Đã hủy"].map((tab, index) => (
          <button
            key={index}
            className={`px-8 py-2 rounded-full ${selectedTab === index ? 'bg-[#51DACF] text-black font-bold' : 'bg-gray-300 text-gray-700'}`}
            onClick={() => setSelectedTab(index)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Sub-tabs */}
      <div className="flex justify-center mb-4">
        <div className="flex w-full max-w-md justify-between">
          {["Sắp diễn ra", "Đã kết thúc"].map((subTab, index) => (
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
        <p className="text-center">Đang tải dữ liệu...</p>
      ) : filteredTickets.length === 0 ? (
        <p className="text-center">Bạn chưa có vé nào.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          {filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              className="flex border rounded-lg shadow-md overflow-hidden bg-[#0C4762] text-white"
              onClick={() => router.push(`/ticket/${ticket.id}`)}
            >
              {/* Ngày tháng */}
              <div className="bg-[#08374A] text-white p-4 flex flex-col items-center justify-center w-24 border-r border-white">
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
                  {ticket.Showing?.Events.title}
                </h3>
                <div className="flex gap-2 mb-2">
                  <span className={`${getStatusColor(ticket.status)} text-xs px-2 py-1 rounded-md`}>
                    {ticket.status === 1 ? "Thành công" : ticket.status === 2 ? "Đang xử lý" : "Đã hủy"}
                  </span>
                  <span className={`border border-green-500 text-green-500 text-xs px-2 py-1 rounded-md`}>
                    {ticket.type === 'electronic' ? "Vé điện tử" : "Vé cứng"}
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
                    : "Chưa có thông tin"}
                </p>
                {/* <p className="text-sm font-medium">
                  📍 {ticket.Showing?.location || "Địa điểm chưa cập nhật"}
                </p> */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TicketManagement;
