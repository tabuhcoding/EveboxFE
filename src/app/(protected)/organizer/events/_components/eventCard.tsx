"use client";

/* Package System */
import { BarChart3, Users, Package, LayoutGrid, Edit } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { EventOrgFrontDisplayDto } from "@/types/models/org/orgEvent.interface";


export default function EventCard({ event }: { event: EventOrgFrontDisplayDto }) {
    return (
        <div className="bg-[#0C4762] p-4 rounded-xl shadow-lg text-white flex flex-col">
            <div className="flex items-center">
                <Image
                    src={event.imgPosterUrl}
                    alt={event.title}
                    width={160}
                    height={96}
                    className="object-cover rounded-lg"
                />
                <div className="ml-4 flex-1">
                    <h2 className="text-xl font-semibold">{event.title}</h2>
                    <p className="text-sm flex items-center mt-3 text-[#51DACF]">
                        📅 {new Date(event.startDate).toLocaleString("vi-VN")}
                    </p>
                    {event.locationString && event.venue ? (
                        <p className="text-sm flex items-center mt-2">
                            📍 {event.venue} <br />
                            {event.locationString}
                        </p>
                    ) : (
                        <p className="text-sm flex items-center mt-2">
                            📍 {event.venue || "Online"} {/* Nếu location rỗng hoặc null, hiển thị "Online" */}
                        </p>
                    )}
                </div>
            </div>
            <hr className="border-t border-white opacity-30 my-4" />
            <div className="flex justify-center space-x-14 text-center">
                <Link href={`/organizer/events/${event.id}/summary-revenue`} className="flex flex-col items-center">
                    <BarChart3 size={18} />
                    <span className="text-sm mt-1">Tổng quan</span>
                </Link>
                <Link href={`/organizer/events/${event.id}/member`} className="flex flex-col items-center">
                    <Users size={18} />
                    <span className="text-sm mt-1">Thành viên</span>
                </Link>
                <Link href={`/organizer/events/${event.id}/orders`} className="flex flex-col items-center">
                    <Package size={18} />
                    <span className="text-sm mt-1">Đơn hàng</span>
                </Link>
                {/* <Link href={`/organizer/events/${event.id}/seating`} className="flex flex-col items-center">
                    <LayoutGrid size={18} />
                    <span className="text-sm mt-1">Sơ đồ ghế</span>
                </Link> */}
                <Link href={`/organizer/create-event/${event.id}?step=info`} className="flex flex-col items-center">
                    <Edit size={18} />
                    <span className="text-sm mt-1">Chỉnh sửa</span>
                </Link>
            </div>
        </div>
    );
}
