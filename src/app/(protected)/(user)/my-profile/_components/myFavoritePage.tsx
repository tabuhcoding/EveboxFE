"use client";

/* Package System */
import { Bell, Loader2 } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";

/* Package Application */
import Pagination from "app/(protected)/admin/event-special-management/_common/pagination";

import { FavoriteProps } from "./libs/interface/favorite.interface";

export default function MyFavoritePage({
    events,
    currentPage,
    itemsPerPage,
    totalPages,
    totalItems,
    isLoading = false,
    onPrevious,
    onNext
}: FavoriteProps) {
    const [isOn, setIsOn] = useState(false);

    const t = useTranslations('common');

    const transWithFallback = (key: string, fallback: string) => {
        const msg = t(key);
        if (!msg || msg.startsWith('common.')) return fallback;
        return msg;
    };

    return (
        <div className="favorite-page max-w-3xl mx-auto mb-10">
            <div className="flex justify-between mt-8">
                <h2 className="text-2xl font-bold">{transWithFallback('favoriteList', 'Danh sách yêu thích của tôi')}</h2>
                <div className="notify-btn">
                    <button onClick={() => setIsOn(!isOn)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-black rounded-full shadow-sm transition-all">
                        <Bell size={18} className={isOn ? "fill-black text-black" : "text-black"} />
                        <span className="text-sm font-medium">
                            {isOn ? transWithFallback('subscribed', 'Đã đăng ký') : transWithFallback('unsubscribed', 'Chưa đăng ký')}
                        </span>
                    </button>
                </div>
            </div>

            <hr className="my-6 border-gray-700" />

            <div className="list-organizer-favorite mt-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-4">
                    <h2 className="text-lg md:text-2lg font-bold">
                        {transWithFallback('event', 'Sự kiện')} <span className="text-teal-400"> {transWithFallback('favorite', 'Yêu thích')}</span>
                    </h2>
                </div>
                {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-teal-400" />
                        <span className="ml-2 text-gray-600">{transWithFallback('loading', 'Đang tải...')}</span>
                    </div>
                )
                    : events.length > 0 ? (
                        <>
                            {events.map((event, _index) => (
                                <div key={event.id}>
                                    <div
                                        className="flex items-center gap-4 p-2 mb-4 bg-white border border-[#0C4762] rounded-xl shadow-sm hover:shadow-md hover:border-teal-500 transition cursor-pointer"
                                        onClick={() => window.location.href = `/event/${event.id}`}>
                                        <div className="w-24 h-24 flex-shrink-0">
                                            <Image
                                                width={200}
                                                height={160}
                                                src={event.imageUrl || 'https://res.cloudinary.com/de66mx8mw/image/upload/v1744458011/defaultImgEvent_spjrst.png'}
                                                alt={event.title}
                                                className="object-cover rounded-lg w-full h-full"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-[#0C4762]">{event.title}</h3>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <Pagination
                                currentPage={currentPage}
                                totalItems={totalItems}
                                totalPages={totalPages}
                                itemsPerPage={itemsPerPage}
                                onPrevious={onPrevious}
                                onNext={onNext} />
                        </>
                    ) : (
                        <p className="text-base">{transWithFallback('noLoveOrg', 'Bạn chưa có Nhà tổ chức yêu thích nào!')}</p>
                    )}
            </div>
        </div>
    )
}