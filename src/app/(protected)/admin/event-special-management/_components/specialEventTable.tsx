'use client';

/* Package System */
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

/* Package Application */
import { EventSpecial, EventSpecialTableProps, SpecialEventAdminParams } from "@/types/models/admin/eventSpecialManagement.interface";
import { Category } from "@/services/interface/eventSpecialTable";
import ToggleSpecialButton from "./toggleSpecialButton";
import ToggleOnlyOnEveButton from "./toggleOnlyOnEveButton";
import ToggleCategoryButton from "./toggleCategoryButton";
import EventPagination from "../../event-management/_components/common/pagination";
import SortIcon from "../../account-management/_components/sortIcon";
import { sortEvents } from "./libs/sortEvents";
import { getSpecialEventsManagment } from "@/services/event.service";
import SpecialEventTableLoading from "./specialEventTableLoading";
import GlobalLoading from "./common/globalLoading";

export default function SpecialEventTable({ searchKeyword, categoryFilter }: EventSpecialTableProps) {
  const router = useRouter();
  const t = useTranslations('common');
  const { data: session } = useSession();

  const [events, setEvents] = useState<EventSpecial[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState<boolean>(true);
  const [sortConfig, setSortConfig] = useState<{ key: keyof EventSpecial; direction: 'asc' | 'desc' } | null>(null);

  const [eventsPerPage, setEventsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [isGlobalLoading, setIsGlobalLoading] = useState<boolean>(false);

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    return !msg || msg.startsWith('common.') ? fallback : msg;
  };

  const fetchEvents = useCallback(async () => {
    try {
      setEvents([]);
      setIsLoadingEvents(true);

      const params: SpecialEventAdminParams = {
        page: currentPage,
        limit: eventsPerPage,
        search: searchKeyword ?? "",
        ...(categoryFilter === '__onlyOnEve' && { isOnlyOnEve: true }),
        ...(categoryFilter === '__special' && { isSpecial: true }),
        ...(typeof categoryFilter === 'number' && { categoryId: categoryFilter }),
      };

      const res = await getSpecialEventsManagment(params, session?.user?.accessToken || "");

      if (res?.statusCode === 200) {
        const { data, pagination } = res.data;
        setEvents(data);
        setTotalItems(pagination.totalItems);
        setTotalPages(pagination.totalPages);
      } else {
        toast.error(`${transWithFallback('errorWhenFetchEvents', 'Lỗi khi tải dữ liệu sự kiện')}`);
      }

    } catch (error) {
      toast.error(`${transWithFallback('errorWhenFetchEvents', 'Lỗi khi tải dữ liệu sự kiện')}: ${error}`);
      setEvents([]);
    } finally {
      setIsLoadingEvents(false);
    }
  }, [categoryFilter, currentPage, eventsPerPage, searchKeyword]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const sortedEvents = sortEvents(events, sortConfig);
  const paginatedData = sortedEvents;

  const handleSort = (key: keyof EventSpecial) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      } else {
        return { key, direction: 'asc' };
      }
    });
  };

  const handleToggleSpecial = (eventId: number, newIsSpecial: boolean) => {
    setEvents((prevEvents) =>
      prevEvents.map((ev) =>
        ev.id === eventId ? { ...ev, isSpecial: newIsSpecial } : ev
      )
    );
  };

  const handleToggleOnlyOnEve = (eventId: number, newIsOnlyOnEve: boolean) => {
    setEvents((prevEvents) =>
      prevEvents.map((ev) =>
        ev.id === eventId ? { ...ev, isOnlyOnEve: newIsOnlyOnEve } : ev
      )
    );
  };

  const handleToggleCategory = (eventId: number, newCategories: Category[]) => {
    setEvents((prevEvents) =>
      prevEvents.map((ev) =>
        ev.id === eventId ? { ...ev, categoryIds: newCategories } : ev
      )
    );
  };

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      <GlobalLoading visible={isGlobalLoading} />
      {isLoadingEvents ? (
        <SpecialEventTableLoading />
      ) : (
        <>
          <div className="table-event-special-management overflow-x-auto rounded-xl shadow-md mt-6">
            <table className="min-w-full border border-gray-200">
              <thead>
                <tr className="bg-[#0C4762] text-center text-white text-xs rounded-t-lg">
                  <th className="px-4 py-3 cursor-pointer min-w-[65px]" onClick={() => handleSort('id')}>
                    ID <SortIcon field="id" sortConfig={sortConfig} />
                  </th>
                  <th className="px-4 py-3 min-w-[84px]">{transWithFallback('poster', 'Poster')}</th>
                  <th className="px-4 py-3 cursor-pointer min-w-[155px]" onClick={() => handleSort('title')}>
                    {transWithFallback('eventName', 'Tên sự kiện')} <SortIcon field="title" sortConfig={sortConfig} />
                  </th>
                  <th className="px-4 py-3 cursor-pointer min-w-[130px]">{transWithFallback('isSpecialEvent', 'Sự kiện đặc biệt')}</th>
                  <th className="px-4 py-3 cursor-pointer min-w-[140px]">{transWithFallback('isOnlyOnEve', 'Chỉ có trên EveBox')}</th>
                  <th className="px-4 py-3 cursor-pointer min-w-[100px]">{transWithFallback('music', 'Âm nhạc')}</th>
                  <th className="px-4 py-3 cursor-pointer min-w-[90px]">{transWithFallback('theatersandart', 'Sân khấu & Nghệ thuật')}</th>
                  <th className="px-4 py-3 cursor-pointer min-w-[100px]">{transWithFallback('sport', 'Thể thao')}</th>
                  <th className="px-4 py-3 cursor-pointer min-w-[82px]">{transWithFallback('other', 'Khác')}</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {paginatedData.length > 0 ? (
                  paginatedData.map((event, index) => (
                    <tr key={event.id ?? index} className="border-t border-gray-200 hover:bg-gray-200 transition-colors duration-200">
                      <td className="px-4 py-3 text-center border-r border-gray-200">{event.id}</td>
                      <td className="px-4 py-3 border-r border-gray-200 cursor-pointer text-center">
                        <img className="rounded-md object-cover transition duration-300 transform hover:scale-150" alt="Event Logo"
                          src={(!event.imgPosterUrl || (event.imgPosterUrl && event.imgPosterUrl.includes('https://domain.com'))) ? '/images/event.png' : event.imgPosterUrl}
                          width={50} height={50}
                        />
                      </td>
                      <td onClick={() => router.push(`/admin/event-management/${event.id}`)} className="px-4 py-3 border-r border-gray-200 cursor-pointer max-w-[200px] align-middle">
                        <div className="line-clamp-2 leading-snug" title={event.title}>
                          {event.title}
                        </div>
                      </td>
                      <ToggleSpecialButton event={event} onToggle={handleToggleSpecial} setGlobalLoading={setIsGlobalLoading} />
                      <ToggleOnlyOnEveButton event={event} onToggle={handleToggleOnlyOnEve} setGlobalLoading={setIsGlobalLoading} />
                      <td className="px-4 py-3 border-r border-gray-200 cursor-pointer max-w-[200px] align-middle">
                        <ToggleCategoryButton event={event} fullCategory={{ id: 1, name: "Âm nhạc" }} onToggle={handleToggleCategory} setGlobalLoading={setIsGlobalLoading} />
                      </td>
                      <td className="px-4 py-3 text-center border-r border-gray-200">
                        <ToggleCategoryButton event={event} fullCategory={{ id: 2, name: "Sân khấu & Nghệ thuật" }} onToggle={handleToggleCategory} setGlobalLoading={setIsGlobalLoading} />
                      </td>
                      <td className="px-4 py-3 border-r border-gray-200 text-center cursor-pointer">
                        <ToggleCategoryButton event={event} fullCategory={{ id: 3, name: "Thể thao" }} onToggle={handleToggleCategory} setGlobalLoading={setIsGlobalLoading} />
                      </td>
                      <td className="action-btn px-4 py-3 border-r border-gray-200 text-center">
                        <ToggleCategoryButton event={event} fullCategory={{ id: 4, name: "Khác" }} onToggle={handleToggleCategory} setGlobalLoading={setIsGlobalLoading} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="text-center py-4 text-gray-500">
                      {transWithFallback('noEventMatchForKeyword', 'Không có sự kiện nào khớp với từ khóa tìm kiếm')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Phân trang */}
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
        </>
      )}
    </>
  )
}