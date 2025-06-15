'use client';

/* Package System */
import { Bell, ChevronLeft, ChevronRight, Heart, MousePointerClick } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from "next-intl";
import { useRef, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperClass } from 'swiper/types';
import 'swiper/css';
import 'swiper/css/navigation';

/* Package Application */
import { addEventOrOrgFavourite, removeEventFavourite, removeOrgFavourite } from '@/services/auth.service';
import { EventSliderProps } from 'types/models/dashboard/dashboard.interface';

import mapEventStatus from '../libs/functions/mapEventStatus';

import '../../../../styles/admin/eventSlider.css';
import '../../../../styles/global.css';

type NavigationOptionsTyped = {
  prevEl?: HTMLElement | null;
  nextEl?: HTMLElement | null;
};

const EventSlider = ({ title, subtitle, events }: EventSliderProps) => {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  const uniqueEvents = events.filter(
    (v, i, a) => a.findIndex((t) => t.id === v.id) === i
  );


  const [swiperInstance, setSwiperInstance] = useState<SwiperClass | null>(null);
  const navigation = swiperInstance?.params.navigation as NavigationOptionsTyped;

  const [windowWidth, setWindowWidth] = useState<number>(typeof window !== "undefined" ? window.innerWidth : 1200);
  const [localEventStates, setLocalEventStates] = useState<Record<number, { isUserFavorite?: boolean; isUserNotice?: boolean }>>({});
  
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (swiperInstance && prevRef.current && nextRef.current) {
      navigation.prevEl = prevRef.current;
      navigation.nextEl = nextRef.current;
      swiperInstance.navigation.destroy();
      swiperInstance.navigation.init();
      swiperInstance.navigation.update();
    }
  }, [swiperInstance, prevRef, nextRef, navigation]);

  const t = useTranslations("common");

  const getCurrentEventState = (eventId: number) => {
    const event = uniqueEvents.find(e => e.id === eventId);
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
        toast.error(transWithFallback("error","Có lỗi xảy ra, vui lòng thử lại!"));
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      toast.error(transWithFallback("error","Có lỗi xảy ra, vui lòng thử lại!"));
    }
  };

  const toggleNotify = async (id: number) => {
    const currentState = getCurrentEventState(id);
    const newNoticeState = !currentState.isUserNotice;
    
    try {
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
        toast.error(transWithFallback("error","Có lỗi xảy ra, vui lòng thử lại!"));
      }
    } catch (error) {
      console.error("Error toggling notification:", error);
      toast.error(transWithFallback("error","Có lỗi xảy ra, vui lòng thử lại!"));
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

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    if (!msg || msg.startsWith('common.')) return fallback;
    return msg;
  };

  const isMobile = windowWidth < 768;
  const showNav = isMobile
    ? uniqueEvents.length > 2
    : uniqueEvents.length > 4;

  return (
    <div className="relative">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-4">
        <h2 className="text-xl md:text-2xl font-bold">
          {title === "" ? '' : transWithFallback(title || "", title || "")}
          {subtitle && <span className="text-teal-400"> {transWithFallback(subtitle || "", subtitle || "")}</span>}
        </h2>
      </div>

      {/* Swiper Slider */}
      <Swiper
        spaceBetween={10}
        modules={[Navigation]}
        onSwiper={setSwiperInstance}
        breakpoints={{
          0: {
            slidesPerView: 2,
            slidesPerGroup: 2,
          },
          768: {
            slidesPerView: 4,
            slidesPerGroup: 4,
          },
        }}
        navigation={showNav ? { prevEl: prevRef.current, nextEl: nextRef.current } : false}
        style={{
          overflowX: 'auto',
          scrollBehavior: 'smooth',
          display: 'flex',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
        className="mySwiper"
      >

        {uniqueEvents.map((event) => {
          const currentState = getCurrentEventState(event.id);
          
          return (
            <SwiperSlide key={event.id} className="h-full">
              <Link href={`/event/${event.id}`} className='no-underline'>
                <div className="bg-[#0C4762] rounded-lg overflow-hidden shadow-md transition-shadow flex flex-col h-full">
                  <div className="flex items-center justify-center p-2 w-full h-auto overflow-hidden">
                    <div className='absolute top-2 left-2 flex items-center gap-2 z-10'>
                      <span className="text-xs text-teal-800 bg-white/80 px-2 py-1 rounded-full flex items-center gap-1">
                        <MousePointerClick className="w-3 h-3" /> {event.totalClicks?.toLocaleString() ?? '123'}
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
                      <time className="text-left text-teal-200">
                        <span>
                          {new Date(event.startDate).toLocaleDateString()}
                        </span>
                      </time>
                      <span
                        className={`rounded-lg px-2 font-medium text-sky-950 text-center md:text-left ${event.status.toUpperCase() === 'EVENT_OVER' ? 'bg-red-300' : 'bg-emerald-200'
                          }`}
                      >
                        {event.status.toUpperCase() === 'AVAILABLE'
                          ? transWithFallback("from", "Từ") + " " + event.minTicketPrice?.toLocaleString('vi-VN') + 'đ'
                          : mapEventStatus(event.status.toUpperCase())}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Các nút custom navigation */}
      {showNav && (
        <>
          <button ref={prevRef} className="custom-swiper-button-prev">
            <ChevronLeft />
          </button>
          <button ref={nextRef} className="custom-swiper-button-next">
            <ChevronRight />
          </button>
        </>
      )}
    </div>
  );
};

export default EventSlider;
