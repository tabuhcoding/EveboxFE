'use client';

/* Package System */
import { CalendarDate } from '@internationalized/date';
import { RangeValue } from '@react-types/shared';
import { ChevronDown, MousePointerClick, Bell, Heart, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useTranslations, useLocale } from 'next-intl';
import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import 'tailwindcss/tailwind.css';

/* Package Application */
import '@/styles/admin/pages/Dashboard.css';
import AlertDialog from '@/components/common/alertDialog';
import { addEventOrOrgFavourite, removeEventFavourite, removeOrgFavourite } from '@/services/auth.service';
import { getAllCategories, getAllProvinces, getSearchEvents, Location } from '@/services/event.service';
import { Category } from '@/types/models/dashboard/frontDisplay';
import { SearchEventsResponse } from '@/types/models/dashboard/searchEvents.interface';
import Pagination from 'app/(protected)/admin/event-special-management/_common/pagination';

import DatePicker from '../../_components/dashboard/datePicker';
import { mapCategoryName } from '../../_components/libs/functions/mapCategoryName';


import RangeSlider from './range-slider';


export default function SearchClient() {
  const [searchText, setSearchText] = useState('');
  const [events, setEvents] = useState<SearchEventsResponse | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number[]>([0, 20000000]);
  const [dateRange, setDateRange] = useState<RangeValue<CalendarDate> | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, _setLimit] = useState(10);
  const [localEventStates, setLocalEventStates] = useState<Record<number, { isUserFavorite?: boolean; isUserNotice?: boolean }>>({});
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [href, setHref] = useState("");
  const { data: session } = useSession();
  const [isSearching, setIsSearching] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const dropdownLocationRef = useRef<HTMLDivElement | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const dropdownEventRef = useRef<HTMLDivElement | null>(null);
  const t = useTranslations('common');
  const locale = useLocale();

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    return !msg || msg.startsWith('common.') ? fallback : msg;
  };

  useEffect(() => {
    const loadLocations = async () => {
      const data = await getAllProvinces();
      setLocations(data);
    };
    loadLocations();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownLocationRef.current && !dropdownLocationRef.current.contains(event.target as Node)) {
        setIsLocationOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    if (locations.length === 0) return;
    const locationParam = searchParams.get('provinceId');
    if (locationParam) {
      const matched = locations.find(loc => loc.id.toString() === locationParam);
      setSelectedLocation(matched || null);
    } else {
      setSelectedLocation(null);
    }
  }, [searchParams, locations]);


  useEffect(() => {
    const initFromParams = () => {
      const title = searchParams.get('title') || '';
      const type = searchParams.get('type') || '';
      const startDate = searchParams.get('startDate');
      const endDate = searchParams.get('endDate');
      const minPrice = parseInt(searchParams.get('minPrice') || '0');
      const maxPrice = parseInt(searchParams.get('maxPrice') || '20000000');
      const pageParam = parseInt(searchParams.get('page') || '1');
      const locationParam = searchParams.get('provinceId');
      if (locationParam) {
        const matched = locations.find(loc => loc.id.toString() === locationParam);
        setSelectedLocation(matched || null);
      } else {
        setSelectedLocation(null);
      }

      setSearchText(title);
      setSelectedOptions(type ? type.split(',') : []);
      setPage(pageParam);
      setPriceRange([minPrice, maxPrice]);

      if (startDate && endDate) {
        setDateRange({
          start: new CalendarDate(
            +startDate.slice(0, 4),
            +startDate.slice(5, 7),
            +startDate.slice(8, 10)
          ),
          end: new CalendarDate(
            +endDate.slice(0, 4),
            +endDate.slice(5, 7),
            +endDate.slice(8, 10)
          ),
        });
      } else {
        setDateRange(null);
      }
    };
    initFromParams();
  }, [searchParams]);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const response = await getSearchEvents({
        title: searchText.trim() || searchParams.get('title') || '',
        type: selectedOptions.join(',') || searchParams.get('type') || '',
        provinceId: selectedLocation?.id.toString() || searchParams.get('provinceId') || '',
        startDate: dateRange?.start?.toString() || searchParams.get('startDate') || undefined,
        endDate: dateRange?.end?.toString() || searchParams.get('endDate') || undefined,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        pages: page,
        limit: limit,
      });

      setEvents(response);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [page]);

  const applyFilters = async (customPage?: number) => {
    const query: Record<string, string> = {
      title: searchText.trim(),
      minPrice: priceRange[0].toString(),
      maxPrice: priceRange[1].toString(),
      page: (customPage ?? page).toString(),
      limit: limit.toString(),
    };
    if (selectedOptions.length > 0) query.type = selectedOptions.join(',');
    if (selectedLocation) query.provinceId = selectedLocation.id.toString();
    if (dateRange?.start) query.startDate = dateRange.start.toString();
    if (dateRange?.end) query.endDate = dateRange.end.toString();

    setIsSearching(true);
    router.push(`/search?${new URLSearchParams(query).toString()}`);

    try {
      const response = await getSearchEvents({
        title: query.title,
        type: query.type || '',
        startDate: query.startDate,
        endDate: query.endDate,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        pages: Number(query.page),
        limit: limit,
      });
      setEvents(response);
      setPage(Number(query.page));
    } catch (err) {
      console.error('Error searching:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handlePrevious = () => {
    if (page > 1) {
      applyFilters(page - 1);
    }
  };

  const handleNext = () => {
    const totalPages = events?.pagination?.totalPages || 0;
    if (page < totalPages) {
      applyFilters(page + 1);
    }
  };

  useEffect(() => {
    const loadCategories = async () => {
      const data = await getAllCategories();
      setCategories(data);
    };

    loadCategories();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownEventRef.current && !dropdownEventRef.current.contains(event.target as Node)) {
        setIsEventTypeOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const [isEventTypeOpen, setIsEventTypeOpen] = useState(false);

  const toggleOption = (option: string) => {
    setSelectedOptions((prev) =>
      prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]
    );
  };

  const getCurrentEventState = (eventId: number) => {
    const event = events?.data?.find(e => e.id === eventId);
    const localState = localEventStates[eventId];

    return {
      isUserFavorite: localState?.isUserFavorite ?? event?.isUserFavorite ?? false,
      isUserNotice: localState?.isUserNotice ?? event?.isUserNotice ?? false
    };
  };

  const toggleLike = async (id: number) => {
    const currentState = getCurrentEventState(id);
    const newFavoriteState = !currentState.isUserFavorite;

    try {
      if (!session?.user?.accessToken) {
        setAlertMessage(transWithFallback("signInToAddFavNoti", "Vui lòng đăng nhập để thêm sự kiện yêu thích!"));
        setHref("/login");
        setAlertOpen(true);
        return;
      }
      const result = await updateFavorite(id, newFavoriteState, true);

      if (result) {
        setLocalEventStates(prev => ({
          ...prev,
          [id]: {
            ...prev[id],
            isUserFavorite: newFavoriteState
          }
        }));

        toast.success(
          newFavoriteState
            ? transWithFallback("liked", "Đã thêm vào danh sách yêu thích!")
            : transWithFallback("unliked", "Đã bỏ khỏi danh sách yêu thích!")
        );
      } else {
        toast.error(transWithFallback("error", "Có lỗi xảy ra, vui lòng thử lại!"));
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      toast.error(transWithFallback("error", "Có lỗi xảy ra, vui lòng thử lại!"));
    }
  };

  const toggleNotify = async (id: number) => {
    const currentState = getCurrentEventState(id);
    const newNoticeState = !currentState.isUserNotice;

    try {
      if (!session?.user?.accessToken) {
        setAlertMessage(transWithFallback("signInToAddNoti", "Vui lòng đăng nhập để thêm thông báo cho sự kiện!"));
        setHref("/login");
        setAlertOpen(true);
        return;
      }

      const result = await updateFavorite(id, newNoticeState, false);

      if (result) {
        setLocalEventStates(prev => ({
          ...prev,
          [id]: {
            ...prev[id],
            isUserNotice: newNoticeState
          }
        }));

        toast.success(
          newNoticeState
            ? transWithFallback("noticed", "Bạn sẽ được nhận thông báo về sự kiện!")
            : transWithFallback("unnoticed", "Bạn đã tắt thông báo về sự kiện này!")
        );
      } else {
        toast.error(transWithFallback("error", "Có lỗi xảy ra, vui lòng thử lại!"));
      }
    } catch (error) {
      console.error("Error toggling notification:", error);
      toast.error(transWithFallback("error", "Có lỗi xảy ra, vui lòng thử lại!"));
    }
  };

  const updateFavorite = async (id: number, newStatus: boolean, isEvent: boolean) => {
    if (newStatus) {
      const response = await addEventOrOrgFavourite(
        {
          itemType: isEvent ? 'EVENT' : 'ORG',
          itemId: id.toString(),
        }
      );

      if (response.data.success) {
        return true;
      }
      return false;
    } else {
      if (isEvent) {
        const response = await removeEventFavourite(id.toString());
        if (response.data.success) {
          return true;
        }
      }
      else {
        const response = await removeOrgFavourite(id.toString());
        if (response.data.success) {
          return true;
        }
      }

      return false;
    }
  }

  const resetFilters = async () => {
    setSearchText('');
    setDateRange(null);
    setSelectedOptions([]);
    setPriceRange([0, 20000000]);
    setSelectedLocation(null);
    setPage(1);
  };

  return (
    <div className="min-h-screen flex flex-col mb-8">
      <main className="flex-1">
        <div className="flex justify-center mt-8">
          <div className="w-full md:w-5/6">
            <div className="flex flex-col gap-4 mb-8">
              <h2 className="text-xl md:text-2xl font-bold whitespace-nowrap">{transWithFallback("searchResult", "Kết quả tìm kiếm")} </h2>
              <div className="flex flex-wrap md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                  <div className="w-full md:w-60">
                    <input
                      type="text"
                      placeholder={transWithFallback("searchPlaceholder", "Tìm kiếm sự kiện...")}
                      className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          applyFilters();
                        }
                      }}
                    />
                  </div>

                  <div className="relative w-full md:w-60 flex-shrink-0 bg-white border border-gray-300 rounded-lg p-1 ">
                    <DatePicker
                      value={dateRange}
                      onDateRangeChange={setDateRange}
                    />
                  </div>

                  <div
                    className="relative w-full md:w-48 flex-shrink-0 bg-white border border-gray-300 p-1 rounded-lg "
                    ref={dropdownEventRef}
                  >
                    <button
                      onClick={() => setIsEventTypeOpen(!isEventTypeOpen)}
                      className="w-full bg-white rounded p-1.5 flex justify-between items-center text-gray-500"
                      style={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      <span className="block overflow-hidden whitespace-nowrap text-ellipsis">
                        {selectedOptions.length > 0
                          ? selectedOptions.map((name) => mapCategoryName(name, transWithFallback)).join(', ')
                          : transWithFallback("categoryHint", 'Loại sự kiện')}
                      </span>
                      <ChevronDown size={16} className="text-gray-500" />
                    </button>

                    {isEventTypeOpen && (
                      <div className="absolute w-full bg-white border border-gray-300 rounded shadow-lg text-[#0C4762] max-h-64 overflow-y-auto z-20">
                        {categories.map((category) => (
                          <label
                            key={category.id}
                            className="flex items-center p-2 hover:bg-[#0C4762] hover:bg-opacity-[0.31] cursor-pointer"
                            style={{ lineHeight: 'normal' }}
                          >
                            <input
                              type="checkbox"
                              checked={selectedOptions.includes(category.name)}
                              onChange={() => toggleOption(category.name)}
                              className="mr-2"
                            />
                            {mapCategoryName(category.name, transWithFallback)}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="relative w-full md:w-60 flex-shrink-0 bg-white border border-gray-300 p-1 rounded-lg" ref={dropdownLocationRef}>
                    <button
                      onClick={() => setIsLocationOpen(!isLocationOpen)}
                      className="w-full bg-white rounded p-1.5 flex justify-between items-center text-gray-500"
                      style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                    >
                      <span>
                        {locale === 'en' ? selectedLocation?.nameEn : selectedLocation?.nameVi || transWithFallback('locationHint', "Chọn địa điểm")}
                      </span>
                      <ChevronDown size={16} className="text-gray-500" />
                    </button>

                    {isLocationOpen && (
                      <div className="absolute w-full bg-white border border-gray-300 rounded shadow-lg text-[#0C4762] max-h-64 overflow-y-auto z-20">
                        {locations.map((provinceId) => (
                          <div
                            key={provinceId.id}
                            role="button"
                            tabIndex={0}
                            className="p-2 hover:bg-[#0C4762] hover:bg-opacity-[0.31] cursor-pointer"
                            onClick={() => {
                              setSelectedLocation(provinceId);
                              setIsLocationOpen(false);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                setSelectedLocation(provinceId);
                                setIsLocationOpen(false);
                              }
                            }}
                            aria-pressed={selectedLocation?.id === provinceId.id}
                          >
                            {locale === 'en' ? provinceId.nameEn : provinceId.nameVi}
                          </div>
                        ))}


                      </div>
                    )}
                  </div>


                  <div className="w-full items-center md:w-72 flex-shrink-0">
                    <RangeSlider
                      value={priceRange}
                      onChange={setPriceRange}
                    />
                  </div>
                </div>

                <div className="w-full md:w-auto flex gap-2">
                  <button
                    className="bg-teal-500 hover:bg-teal-400 text-white font-semibold py-2 px-6 rounded-lg shadow"
                    onClick={() => applyFilters(1)}
                  >
                    {isSearching ? (
                      <Loader2 size={20} className="text-white animate-spin" />
                    ) : (
                      transWithFallback("search", "Áp dụng")
                    )}
                  </button>
                  <button
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-lg shadow"
                    onClick={resetFilters}
                  >
                    {transWithFallback("reset", "Thiết lập lại")}
                  </button>
                </div>

              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-gray-200 animate-pulse h-64 rounded-lg shadow-md"
                  ></div>
                ))}
              </div>
            ) : events?.data.length === 0 ? (
              <p className="text-center text-gray-500 mt-10">
                {transWithFallback("noResults", "Không tìm thấy sự kiện nào phù hợp.")}
              </p>
            ) : (
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {events?.data.map((event) => {
                    const currentState = getCurrentEventState(event.id);
                    return (
                      <div key={event.id}>
                        <Link href={`/event/${event.id}`} className='no-underline'>
                          <div className="bg-[#0C4762] relative rounded-lg overflow-hidden shadow-md transition-shadow flex flex-col h-full">
                            <div className="flex items-center justify-center p-2 w-full h-auto overflow-hidden">
                              <div className='absolute top-2 left-2 flex items-center gap-2 z-10'>
                                <span className="text-xs text-teal-800 bg-white/80 px-2 py-1 rounded-full flex items-center gap-1">
                                  <MousePointerClick className="w-3 h-3" /> {event?.totalClicks?.toLocaleString() ?? '0'}
                                </span>
                              </div>
                              <div className="favorite-heart-btn absolute top-2 right-2 flex items-center gap-2 z-10">
                                <button className="bg-white p-1 rounded-full hover:bg-red-100 transition"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    toggleLike(event.id);
                                  }}
                                >
                                  <div title='Thêm vào yêu thích'>
                                    <Heart className={`w-4 h-4 ${currentState.isUserFavorite ? "text-red-500 fill-red-500" : "text-gray-500"}`} />
                                  </div>
                                </button>
                                <button className="bg-white p-1 rounded-full hover:bg-yellow-100 transition"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    toggleNotify(event.id);
                                  }}
                                >
                                  <div title='Nhận thông báo'>
                                    <Bell className={`w-4 h-4 ${currentState.isUserNotice ? "text-yellow-500 fill-yellow-500" : "text-gray-500"}`} />
                                  </div>
                                </button>
                              </div>
                              <Image
                                src={
                                  event?.imgPosterUrl ||
                                  '/images/dashboard/card_pic.png'
                                }
                                alt={event.title}
                                className="w-full aspect-video object-cover rounded-lg hover:scale-110 transition-transform duration-300 padding-30"
                                width={140}
                                height={100}
                              />
                            </div>
                            <div className="p-3 flex flex-col flex-grow">
                              <h3 className="font-bold text-left text-sm mb-2 text-white line-clamp-2 min-h-[36px] leading-tight">
                                {event.title}
                              </h3>
                              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 mb-2 text-[14px]">
                                {event.startDate !== "9999-12-31T23:59:59.999Z" && (
                                  <>
                                    <time className="text-left text-teal-200">
                                      <span>
                                        {new Date(event.startDate).toLocaleDateString()}
                                      </span>
                                    </time>
                                    {event.minTicketPrice !== undefined && (
                                      <span className="rounded-lg px-2 font-medium text-sky-950 text-center md:text-left bg-emerald-200">
                                        {`${transWithFallback("from", "Từ")} ${event.minTicketPrice.toLocaleString('vi-VN')}đ`}
                                      </span>
                                    )}
                                  </>
                                )}

                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    );
                  })}
                </div>
                <AlertDialog
                  message={alertMessage}
                  open={alertOpen}
                  onClose={() => setAlertOpen(false)}
                  {...href ? { href } : {}}
                />
                <Pagination
                  currentPage={events?.pagination?.page || 1}
                  totalItems={events?.pagination?.totalItems || 0}
                  totalPages={events?.pagination?.totalPages || 0}
                  itemsPerPage={events?.pagination?.limit || 10}
                  onPrevious={handlePrevious}
                  onNext={handleNext}
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}