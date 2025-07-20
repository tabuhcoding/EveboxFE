'use client';

/* Package System */
import { useTranslations } from "next-intl";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { CalendarOff, Check } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";

/* Package Application */
import ConfirmApprovalDialog from "./dialog/confirmApproval";
import ConfirmDeleteDialog from "./dialog/confirmDelete";
import ConfirmSupspendDialog from "./dialog/confirmSuspend";
// import Pagination from "./_components/common/pagination";
import EventPagination from "./common/pagination";
import SortIcon from "../../account-management/_components/sortIcon";
import EventTableSkeleton from "./common/eventTableSkeleton";

import { EventTableProps, EventAdminDataDto } from "@/types/models/admin/eventManagement.interface";

import { sortEvents } from "./libs/sortEvent";
import { getEventsAdmin, updateEventAdmin } from "@/services/event.service";
import { useAuth } from "@/contexts/auth.context";

export default function EventTable({ activeTab, searchKeyword, categoryFilter, dateFrom, dateTo, adminFilter, onLoadFinish, onTotalChange }: EventTableProps) {
  const router = useRouter();
  const t = useTranslations('common');
  const { session } = useAuth();

  const [events, setEvents] = useState<EventAdminDataDto[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState<boolean>(true);
  const [isLoadingEventAction, setIsLoadingEventAction] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<EventAdminDataDto | null>(null);

  const [sortConfig, setSortConfig] = useState<{ key: keyof EventAdminDataDto; direction: 'asc' | 'desc' } | null>(null);
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false);
  const [isSupspendDialogOpen, setIsSupspendDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [eventsPerPage, setEventsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const fetchEvents = useCallback(async () => {
    setIsLoadingEvents(true);
    try {
      setEvents([]);
      const mapCategoryNameToId = (name: string): number | undefined => {
        switch (name) {
          case 'music':
            return 1;
          case 'theatersandart':
            return 2;
          case 'sport':
            return 3;
          case 'other':
            return 4;
          default: return undefined;
        }
      };

      const res = await getEventsAdmin({
        page: searchKeyword && searchKeyword !== "" ? 1 : currentPage,
        limit: eventsPerPage,
        createdFrom: dateFrom || undefined,
        createdTo: dateTo || undefined,
        isApproved: activeTab === "approved" ? true : activeTab === "pending" ? false : undefined,
        categoryId: categoryFilter ? mapCategoryNameToId(categoryFilter) : undefined,
        isDeleted: activeTab === "deleted" ? true : undefined,
        title: searchKeyword ?? "",
        admin: adminFilter ? adminFilter : undefined
      }, session?.user?.accessToken || "");

      if (res.statusCode === 200) {
        setEvents(res.data.data);
        setTotalItems(res.data.pagination.totalItems);
        setTotalPages(res.data.pagination.totalPages);
        onTotalChange?.(res.data.pagination.totalItems); 
      }
    } catch (error) {
      toast.error(`${transWithFallback('errorWhenFetchEvents', 'Lỗi khi tải dữ liệu sự kiện')}: ${error}`);
      setEvents([]);
    } finally {
      setIsLoadingEvents(false);
      onLoadFinish?.();
    }
  }, [activeTab, adminFilter, categoryFilter, currentPage, dateFrom, dateTo, eventsPerPage, searchKeyword]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const sortedEvents = sortEvents(events, sortConfig);
  const paginatedData = sortedEvents;

  const handleSort = (key: keyof EventAdminDataDto) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      } else {
        return { key, direction: 'asc' };
      }
    });
  };

  const handleApprovalClick = (event: EventAdminDataDto) => {
    setSelectedEvent(event);
    setIsApprovalDialogOpen(true);
  };

  const handleConfirmApproval = async () => {
    if (selectedEvent) {
      try {
        setIsLoadingEventAction(true);
        const result = await updateEventAdmin(selectedEvent.id, {
          isApproved: true,
        }, session?.user?.accessToken || "");

        if (result.statusCode !== 200) {
          toast.error("Duyệt sự kiện thất bại!");
          return;
        }

        toast.success("Duyệt sự kiện thành công!");
        fetchEvents();
      } catch (error) {
        toast.error(`Lỗi khi duyệt sự kiện: ${error}`);
      } finally {
        setIsLoadingEventAction(false);
      }
    }
  };

  const handleSupspendClick = (event: EventAdminDataDto) => {
    setSelectedEvent(event);
    setIsSupspendDialogOpen(true);
  };

  const handleConfirmSupspend = async () => {
    if (selectedEvent) {
      try {
        setIsLoadingEventAction(true);
        const result = await updateEventAdmin(selectedEvent.id, {
          isApproved: false,
        }, session?.user?.accessToken || "");

        if (result.statusCode !== 200) {
          toast.error("Đình chỉ sự kiện thất bại!");
          return;
        }

        toast.success("Đình chỉ sự kiện thành công!");
        fetchEvents();
      } catch (error) {
        console.error("🚀 ~ handleConfirmSupspend ~ error:", error)
        toast.error(`Lỗi khi đình chỉ sự kiện: ${error}`);
      } finally {
        setIsLoadingEventAction(false);
      }
    }
  };

  const handleConfirmDelete = () => {
    if (selectedEvent) {
      const updatedData = events.filter(item => item.id !== selectedEvent.id);
      setEvents(updatedData);
      setSelectedEvent(null);
      setIsDeleteDialogOpen(false);
      toast.success("Xóa sự kiện thành công!");
    }
  };

  const handleTransferCategory = (cat: string): string => {
    switch (cat) {
      case 'music': return transWithFallback('music', 'Âm nhạc')
      case 'theatersandart': return transWithFallback('theatersandart', 'Sân khấu & Nghệ thuật')
      case 'sport': return transWithFallback('sport', 'Thể thao')
      default: return transWithFallback('other', 'Khác')
    }
  }

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    return !msg || msg.startsWith('common.') ? fallback : msg;
  };

  return (
    isLoadingEvents ? (
      <EventTableSkeleton />
    ) : (
      <>
        <div className="table-event-management overflow-x-auto rounded-xl shadow-md mt-6">
          <table className="min-w-full border border-gray-200">
            <thead>
              <tr className="bg-[#0C4762] text-center text-white text-xs rounded-t-lg">
                <th className="px-4 py-3 cursor-pointer min-w-[64px]" onClick={() => handleSort('id')}>
                  ID <SortIcon field="id" sortConfig={sortConfig} />
                </th>
                <th className="px-4 py-3 min-w-[85px]">{transWithFallback('poster', 'Poster')}</th>
                <th className="px-4 py-3 cursor-pointer min-w-[160px]" onClick={() => handleSort('title')}>
                  {transWithFallback('eventName', 'Tên sự kiện')} <SortIcon field="title" sortConfig={sortConfig} />
                </th>
                <th className="px-4 py-3 cursor-pointer min-w-[100px]">
                  {transWithFallback('eventCategory', 'Thể loại')}
                </th>
                <th className="px-4 py-3 cursor-pointer min-w-[140px]">
                  {transWithFallback('location', 'Địa điểm')}
                </th>
                <th className="px-4 py-3 cursor-pointer min-w-[118px]" onClick={() => handleSort('organizerId')}>
                  {transWithFallback('createdBy', 'Người tạo')} <SortIcon field="organizerId" sortConfig={sortConfig} />
                </th>
                <th className="px-4 py-3 cursor-pointer min-w-[102px]" onClick={() => handleSort('createdAt')}>
                  {transWithFallback('createdDate', 'Ngày tạo')} <SortIcon field="createdAt" sortConfig={sortConfig} />
                </th>
                <th className="px-4 py-3 cursor-pointer">
                  {transWithFallback('status', 'Trạng thái')}
                </th>
                {activeTab !== "deleted" && <th className="px-4 py-3 cursor-pointer min-w-[82px]">{transWithFallback('action', 'Thao tác')}</th>}
              </tr>
            </thead>
            <tbody className="text-xs">
              {paginatedData.length > 0 ? (
                paginatedData.map((event) => (
                  <tr key={event.id} className="border-t border-gray-200 hover:bg-gray-200 transition-colors duration-200">
                    <td className="px-4 py-3 text-center border-r border-gray-200">{event.id}</td>
                    <td className="px-4 py-3 border-r border-gray-200 text-center">
                      <Image
                        className="rounded-md object-cover transition duration-300 transform hover:scale-150"
                        alt="Event Poster"
                        src={(!event.imgPosterUrl || (event.imgPosterUrl && event.imgPosterUrl.includes('https://domain.com'))) ? '/images/event.png' : event.imgPosterUrl}
                        width={50}
                        height={50}
                      />
                    </td>
                    <td onClick={() => router.push(`/admin/event-management/${event.id}`)} className="px-4 py-3 border-r border-gray-200 cursor-pointer max-w-[200px] align-middle">
                      <div className="line-clamp-2 leading-snug" title={event.title}>
                        {event.title}
                      </div>
                    </td>
                    <td className="px-4 py-3 border-r border-gray-200 max-w-[200px]">
                      <div className="line-clamp-3 leading-snug" title={event.categories.map(c => c.name).join(", ")}>
                        {event.categories.map(c => handleTransferCategory(c.name)).join(", ")}
                      </div>
                    </td>
                    <td className="px-4 py-3 border-r border-gray-200">
                      <div className="line-clamp-2 leading-snug" title={event.venue ?? ''}>
                        {event.venue}
                      </div>
                    </td>
                    <td className="px-4 py-3 border-r border-gray-200">{event.organizerId}</td>
                    <td className="px-4 py-3 text-center border-r border-gray-200">
                      {new Date(event.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-4 py-3 border-r border-gray-200 text-center">
                      <span className={`min-w-[90px] inline-block px-4 py-1 rounded-full text-xs font-semibold border
                                            ${event.deleteAt
                          ? 'bg-gray-200 text-gray-500 border-gray-500'
                          : event.isApproved
                            ? 'bg-teal-100 text-teal-500 border-teal-500'
                            : 'bg-yellow-100 text-yellow-500 border-yellow-500'
                        }`}>
                        {event.deleteAt ? transWithFallback('deleted', 'Đã xóa') : event.isApproved ? transWithFallback('approved', 'Đã duyệt') : transWithFallback('pending', 'Chờ duyệt')}
                      </span>
                    </td>
                    {!event.deleteAt && (
                      <td className="px-4 py-3 border-r border-gray-200 text-center">
                        <div className="flex justify-center items-center gap-x-2">
                          {!event.deleteAt && !event.isApproved && event.canManage && (
                            <Check className="p-1 bg-teal-400 text-white rounded w-6 h-6 cursor-pointer"
                              onClick={() => handleApprovalClick(event)} />
                          )}

                          {!event.deleteAt && event.isApproved && event.canManage && (
                            <CalendarOff className="p-1 bg-yellow-400 text-white rounded w-6 h-6 cursor-pointer"
                              onClick={() => handleSupspendClick(event)} />
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="text-center py-4 text-gray-500">
                    {transWithFallback('noFitEvent', 'Không có sự kiện nào khớp với tìm kiếm')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <EventPagination
          currentPage={currentPage}
          totalItems={totalItems}
          eventsPerPage={eventsPerPage}
          onPageChange={handlePageChange}
          setEventsPerPage={(num) => {
            setEventsPerPage(num);
            setCurrentPage(1);
          }}
        />

        {selectedEvent && (
          <>
            <ConfirmApprovalDialog
              open={isApprovalDialogOpen}
              onClose={() => setIsApprovalDialogOpen(false)}
              onConfirm={handleConfirmApproval}
              isLoading={isLoadingEventAction}
            />
            <ConfirmSupspendDialog
              open={isSupspendDialogOpen}
              onClose={() => setIsSupspendDialogOpen(false)}
              onConfirm={handleConfirmSupspend}
              isLoading={isLoadingEventAction}
            />
            <ConfirmDeleteDialog
              open={isDeleteDialogOpen}
              onClose={() => setIsDeleteDialogOpen(false)}
              onConfirm={handleConfirmDelete}
              isLoading={isLoadingEventAction}
            />
          </>
        )}
      </>
    )
  )
}
