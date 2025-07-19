"use client";

/* Package System */
import { BarChart3, Users, Package, Edit } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { CircularProgress } from "@mui/material";

/* Package Application */
import { EventOrgFrontDisplayDto } from "@/types/models/org/orgEvent.interface";

export default function EventCard({ event }: { event: EventOrgFrontDisplayDto }) {
  const t = useTranslations("common");
  const router = useRouter();
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    if (!msg || msg.startsWith("common.")) return fallback;
    return msg;
  };

  const navItems = [
    {
      href: `/organizer/events/${event.id}/summary-revenue`,
      icon: <BarChart3 size={18} />,
      label: transWithFallback("overview", "Tổng quan"),
    },
    {
      href: `/organizer/events/${event.id}/member`,
      icon: <Users size={18} />,
      label: transWithFallback("members", "Thành viên"),
    },
    {
      href: `/organizer/events/${event.id}/orders`,
      icon: <Package size={18} />,
      label: transWithFallback("orders", "Đơn hàng"),
    },
    {
      href: `/organizer/create-event/${event.id}?step=info`,
      icon: <Edit size={18} />,
      label: transWithFallback("edit", "Chỉnh sửa"),
    },
  ];

  const handleClick = (href: string, index: number) => {
    setLoadingIndex(index);
    startTransition(() => {
      router.push(href);
    });
  };

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
              📍 {event.venue || transWithFallback("online", "Online")}
            </p>
          )}
        </div>
      </div>

      <hr className="border-t border-white opacity-30 my-4" />

      <div className="flex justify-center space-x-14 text-center">
        {navItems.map((item, i) => (
          <button
            key={i}
            onClick={() => handleClick(item.href, i)}
            disabled={isPending}
            className="flex flex-col items-center text-white focus:outline-none"
          >
            {isPending && loadingIndex === i ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              item.icon
            )}
            <span className="text-sm mt-1">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
