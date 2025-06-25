'use client';

/* Package System */
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ArrowLeft, MapPin, House } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

/* Package Application */
import { EventDetailAdmin } from "@/types/models/admin/eventManagement.interface";
import { getEventDetailAdmin } from "@/services/event.service";
import EventDetailLoading from "./eventDetailLoading";
import ShowingTable from "./showingTable";

export default function EventDetailPage({ eventId }: { eventId: number }) {
  const router = useRouter();
  const t = useTranslations('common');
  const { data: session } = useSession();

  const [event, setEvent] = useState<EventDetailAdmin | null>(null);
  const [isLoadingEvent, setIsLoadingEvent] = useState<boolean>(true);

  useEffect(() => {
    const fetchEventDetail = async () => {
      setIsLoadingEvent(true);
      try {
        const res = await getEventDetailAdmin(eventId, session?.user?.accessToken);

        if (res.statusCode === 200) {
          console.log("🚀 ~ fetchEventDetail ~ res.data:", res.data)
          setEvent(res.data);
        }
        else {
          toast.error(`Lỗi khi tải dữ liệu sự kiện: ${res?.message}`)
        }
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu sự kiện', error);
        toast.error(`Lỗi khi tải dữ liệu sự kiện: ${error}`)
      } finally {
        setIsLoadingEvent(false);
      }
    };

    fetchEventDetail();
  }, [eventId]);

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    return !msg || msg.startsWith('common.') ? fallback : msg;
  };

  const handleTransferCategory = (cat: string): string => {
    switch (cat) {
      case 'music': return transWithFallback('music', 'Âm nhạc')
      case 'theatersandart': return transWithFallback('theatersandart', 'Sân khấu & Nghệ thuật')
      case 'sport': return transWithFallback('sport', 'Thể thao')
      default: return transWithFallback('other', 'Khác')
    }
  }

  return (
    <>
      <div className="flex items-center space-x-2">
        <ArrowLeft onClick={() => router.back()} size={30} className="text-[#0C4762] cursor-pointer hover:opacity-80 transition-opacity duration-200" />
        <h1 className="text-2xl font-bold text-[#0C4762] mb-1">{transWithFallback('eventInfo', 'Thông tin Sự kiện')}</h1>
      </div>

      <div className="border-t-2 border-[#0C4762] mt-2"></div>

      {isLoadingEvent ? (
        <EventDetailLoading />
      ) : (
        <>
          <h1 className="text-2xl font-semibold text-center mt-6">{event?.title}</h1>

          <div className="detail-event max-w-4xl mx-auto bg-white rounded-xl shadow-md p-12 mt-6 mb-10">
            <div className="flex justify-center mb-6">
              <Image className="rounded-md" alt="Event Logo"
                src={event?.imgPosterUrl || "https://res.cloudinary.com/de66mx8mw/image/upload/v1744458011/defaultImgEvent_spjrst.png"}
                width={300} height={200}
              />
            </div>
            <div className="mt-6">
              {/* <p className="mt-2 flex items-center gap-1">
            <Calendar size={18} /> 
          </p> */}
              <p className="mt-2 flex items-center gap-1">
                <House size={18} /> {event?.venue}
              </p>
              <p className="mt-2 flex items-center gap-1">
                <MapPin size={18} /> {event?.locationsString}
              </p>
              <div className="mt-2">
                <span className="font-semibold">{transWithFallback('description', 'Mô tả')}: </span>
                <div
                  className="prose prose-sm max-w-none pl-10"
                  dangerouslySetInnerHTML={{ __html: event?.description || "" }}
                />
              </div>
              <p className="mt-2">
                <span className="font-semibold">{transWithFallback('eventID', 'ID sự kiện')}: </span> {event?.id}
              </p>
              <p className="mt-2">
                <span className="font-semibold">{transWithFallback('eventType', 'Loại sự kiện')}: </span>
                {event?.isOnline ? "Online" : "Offline"}
              </p>
              <p className="mt-2">
                <span className="font-semibold">{transWithFallback('eventCategory', 'Thể loại sự kiện')}: </span>
                {event?.categories.map(cat => handleTransferCategory(cat.name)).join(", ")}
              </p>
              <p className="mt-2">
                <span className="font-semibold">{transWithFallback('createdBy', 'Người tạo')}: </span> {event?.organizerId}
              </p>
              <p className="mt-2">
                <span className="font-semibold">{transWithFallback('createdDate', 'Ngày tạo sự kiện')}: </span>
                {event?.createdAt ? new Date(event?.createdAt).toLocaleString() : "N/A"}
              </p>
              <p className="mt-2">
                <span className="font-semibold">{transWithFallback('status', 'Trạng thái sự kiện')}: </span>
                <span className={`text-center inline-block px-4 py-1 rounded-full text-xs font-semibold border                                                               
                                              ${event?.deleteAt ? 'bg-gray-200 text-gray-500 border-gray-500'
                    : event?.isApproved
                      ? 'bg-teal-100 text-teal-500 border-teal-500'
                      : 'bg-yellow-100 text-yellow-500 border-yellow-500'
                  }`}>
                  {event?.deleteAt ? transWithFallback('deleted', 'Đã xóa') : event?.isApproved ? transWithFallback('approved', 'Đã duyệt') : transWithFallback('pending', 'Chờ duyệt')}
                </span>
              </p>
            </div>
          </div>
          <h2 className="text-xl font-semibold mt-6 mb-3 px-8">{transWithFallback('showingManagement', 'Quản lý suất diễn sự kiện')}</h2>
          
          {event && event.showing && (
            <ShowingTable showings={event.showing} />
          )}
        </>
      )}
    </>
  )
}