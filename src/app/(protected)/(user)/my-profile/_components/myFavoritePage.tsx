"use client";

/* Package System */
import Image from "next/image";
import { useState } from "react";
import { Bell } from "lucide-react";

/* Package Application */
// import EventSlider from "@/app/(dashboard)/components/dashboard/eventSlider";
// import Pagination from "@/app/(admin)/admin/event-special-management/components/common/pagination";
import { FavoriteProps } from "./libs/interface/favorite.interface";

export default function MyFavoritePage({
    events,
    favoriteOrganizers,
    paginatedData,
    currentPage,
    itemsPerPage,
    onPrevious,
    onNext
}: FavoriteProps) {
    const [isOn, setIsOn] = useState(false);

    return (
        <div className="favorite-page max-w-3xl mx-auto mb-10">
            <div className="flex justify-between mt-8">
                <h2 className="text-2xl font-bold">Danh sách yêu thích của tôi</h2>
                <div className="notify-btn">
                    <button onClick={() => setIsOn(!isOn)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-black rounded-full shadow-sm transition-all">
                        <Bell size={18} className={isOn ? "fill-black text-black" : "text-black"}/>
                        <span className="text-sm font-medium">
                            {isOn ? "Đã đăng ký" : "Chưa đăng ký"}
                        </span>
                    </button>
                </div>
            </div>

            <hr className="my-6 border-gray-700" />

            <div className="list-event-favorite">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-4">
                    <h2 className="text-lg md:text-2lg font-bold">
                        Sự kiện <span className="text-teal-400"> Yêu thích</span>
                    </h2>
                </div>
                {/* {events.favoriteEvents.length > 0 ? (
                    <EventSlider title="" subtitle="" events={events.favoriteEvents} />
                ) : (
                    <p className="text-base">Bạn chưa có Sự kiện yêu thích nào!</p>
                )} */}
            </div>

            {/* <div className="list-organizer-favorite mt-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-4">
                    <h2 className="text-lg md:text-2lg font-bold">
                        Nhà tổ chức <span className="text-teal-400"> Yêu thích</span>
                    </h2>
                </div>
                {paginatedData.length > 0 ? (
                    <>
                        {paginatedData.map((org) => (
                            <div key={org.id} className="flex items-center">
                                <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center text-base">
                                    <Image
                                        width={200}
                                        height={160}
                                        src={org.Images_Events_imgLogoIdToImages?.imageUrl || 'https://res.cloudinary.com/de66mx8mw/image/upload/v1744458011/defaultImgEvent_spjrst.png'}
                                        alt={org.orgName}
                                        className="object-cover rounded-md"
                                    />
                                </div>
                                <div className="ml-4">
                                    <h2 className="text-base px-2 md:text-base font-bold">{org.orgName}</h2>
                                    <div
                                        className="prose max-w-none px-2 text-gray-800"
                                        dangerouslySetInnerHTML={{ __html: org.orgDescription }}
                                    />
                                </div>
                            </div>
                        ))}
                        <Pagination
                            currentPage={currentPage}
                            totalItems={favoriteOrganizers.length}
                            itemsPerPage={itemsPerPage}
                            onPrevious={onPrevious}
                            onNext={onNext} />
                    </>
                ) : (
                    <p className="text-base">Bạn chưa có Nhà tổ chức yêu thích nào!</p>
                )}
            </div> */}
        </div>
    )
}