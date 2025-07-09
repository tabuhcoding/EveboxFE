'use client';

/* Package System */
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Eye } from "lucide-react";
import { HttpStatusCode } from "axios";
import toast from "react-hot-toast";

/* Package Application */
import { Showing, ShowingTableProps } from "@/types/models/admin/showingManagement.interface";
import SortIcon from "../../account-management/_components/sortIcon";
import ShowingTableLoading from "./showingTableLoading";
import EventPagination from "../../event-management/_components/common/pagination";

import { sortShowings } from "../libs/sortShowing";
import { getShowingsByAdmin } from "@/services/event.service";
import { useAuth } from "@/contexts/auth.context";

export default function ShowingTable({ searchKeyword, dateFrom, dateTo }: ShowingTableProps) {
  const t = useTranslations('common');
  const router = useRouter();
  const { session } = useAuth();

  const [showings, setShowings] = useState<Showing[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Showing; direction: 'asc' | 'desc' } | null>(null);

  const [showingsPerPage, setShowingsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    return !msg || msg.startsWith('common.') ? fallback : msg;
  };

  const fetchShowings = useCallback(async () => {
    try {
      setIsLoading(true);
      setShowings([]);

      const res = await getShowingsByAdmin({
        page: currentPage,
        limit: showingsPerPage,
        startTime: dateFrom || undefined,
        endTime: dateTo || undefined,
        search: searchKeyword || undefined,
      }, session?.user?.accessToken || "");

      if (res?.statusCode === HttpStatusCode.Ok) {
        setShowings(res.data.data);
        setTotalItems(res.data.pagination.totalItems);
        setTotalPages(res.data.pagination.totalPages);
      }
    } catch (error) {
      toast.error(`${transWithFallback('errorWhenFetchShowings', 'Lỗi khi tải dữ liệu suất diễn')}: ${error}`);
      setShowings([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchKeyword, dateFrom, dateTo, currentPage, showingsPerPage]);

  useEffect(() => {
    fetchShowings();
  }, [fetchShowings]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchKeyword]);

  const handleSort = (key: keyof Showing) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      } else {
        return { key, direction: 'asc' }; // Mặc định là asc
      }
    });
  };

  const sortedShowings = sortShowings(showings, sortConfig);
  const paginatedData = sortedShowings;

  return (
    isLoading ? (
      <ShowingTableLoading />
    ) : (
      <>
        <div className="table-showing-management overflow-x-auto rounded-xl shadow-md mt-6">
          <table className="min-w-full border border-gray-200">
            <thead>
              <tr className="bg-[#0C4762] text-center text-white text-xs rounded-t-lg">
                <th className="px-4 py-3 cursor-pointer min-w-[64px]" onClick={() => handleSort("id")}>
                  ID<SortIcon field="id" sortConfig={sortConfig} />
                </th >
                <th className="px-4 py-3 cursor-pointer min-w-[160px]" onClick={() => handleSort("eventTitle")}>
                  {transWithFallback('eventName', 'Tên sự kiện')} <SortIcon field="eventTitle" sortConfig={sortConfig} />
                </th>
                <th className="px-4 py-3 cursor-pointer min-w-[100px]" onClick={() => handleSort("startTime")}>
                  {transWithFallback('startDateTime', 'Ngày-giờ bắt đầu')} <SortIcon field="startTime" sortConfig={sortConfig} />
                </th>
                <th className="px-4 py-3 cursor-pointer min-w-[140px]" onClick={() => handleSort("endTime")}>
                  {transWithFallback('endDateTime', 'Ngày-giờ kết thúc')} <SortIcon field="endTime" sortConfig={sortConfig} />
                </th>
                <th className="px-4 py-3 cursor-pointer min-w-[118px]" onClick={() => handleSort("seatmapId")}>
                  {transWithFallback('seatmap', 'Sơ đồ chỗ ngồi')} <SortIcon field="seatMapId" sortConfig={sortConfig} />
                </th>
                <th className="px-4 py-3 cursor-pointer min-w-[102px]" onClick={() => handleSort("ticketTypes")}>
                  {transWithFallback('numTicketTypes', 'Số loại vé')} <SortIcon field="numTicketType" sortConfig={sortConfig} />
                </th>
                <th className="px-4 py-3 cursor-pointer min-w-[82px]">{transWithFallback('action', 'Thao tác')}</th>
              </tr >
            </thead >
            <tbody className="text-xs">
              {paginatedData.length > 0 ? (
                paginatedData.map((showing, index) => (
                  <tr key={showing.id ?? index} className="border-t border-gray-200 hover:bg-gray-200 transition-colors duration-200">
                    <td className="px-4 py-3 text-center border-r border-gray-200">{showing.id}</td>
                    <td className="px-4 py-3 border-r border-gray-200 cursor-pointer max-w-[200px] align-middle">
                      <div className="line-clamp-2 leading-snug" title={showing.event.title}>
                        {showing.eventTitle}
                      </div>
                    </td>
                    <td className="px-4 py-3 border-r border-gray-200 cursor-pointer max-w-[200px] align-middle">
                      <div className="line-clamp-3 leading-snug text-center">
                        <span>{`${new Date(showing.startTime).toLocaleDateString('vi-VN')} - ${new Date(showing.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false })}`}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 border-r border-gray-200 cursor-pointer max-w-[200px] align-middle">
                      <div className="line-clamp-2 leading-snug text-center">
                        <span>{`${new Date(showing.endTime).toLocaleDateString('vi-VN')} - ${new Date(showing.endTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false })}`}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center border-r border-gray-200">
                      {showing.seatmapId === 0 ? transWithFallback('no', 'Không') : transWithFallback('yes', 'Có')}
                    </td>
                    <td className="px-4 py-3 border-r border-gray-200 text-center cursor-pointer">
                      {showing.ticketTypes.length} {transWithFallback('ticketTypes', 'loại vé')}
                    </td>
                    <td className="action-btn px-4 py-3 border-r border-gray-200 text-center">
                      <div className="flex justify-center items-center gap-x-2">
                        <div title="Xem chi tiết" onClick={() => router.push(`/admin/showing-management/${showing.id}`)}>
                          <Eye className="approve-btn p-1 bg-teal-400 text-white rounded w-6 h-6 cursor-pointer" />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="text-center py-4 text-gray-500">
                    {transWithFallback('noShowingMatchForKeyword', 'Không có suất diễn nào khớp với từ khóa tìm kiếm')}
                  </td>
                </tr>
              )}
            </tbody>
          </table >
        </div >

        <EventPagination
          currentPage={currentPage}
          totalItems={totalItems}
          eventsPerPage={showingsPerPage}
          onPageChange={handlePageChange}
          setEventsPerPage={(num) => {
            setShowingsPerPage(num);
            setCurrentPage(1);
          }}
        />
      </>
    )
  )
}
