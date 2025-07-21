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
import { getEventMembers } from "@/services/org.service";
import { useAuth } from "@/contexts/auth.context";
import toast from "react-hot-toast";

export default function EventCard({ event }: { event: EventOrgFrontDisplayDto }) {
  const t = useTranslations("common");
  const router = useRouter();
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();
  const { session } = useAuth();

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
      href: `/organizer/events/${event.id}/marketing`,
      icon: <Users size={18} />,
      label: transWithFallback("analysis", "Phân tích"),
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
    {
      href: `/organizer/events/${event.id}/check-in`,
      icon: <Edit size={18} />,
      label: transWithFallback("checkIn", "Checkin"),
    }
  ];

  const handleClick = (href: string, index: number) => {
    const allowRoles = [0, 1, 3]
    if (allowRoles.includes(index)) {
      const fetchMember = async () => {
        const member = await getEventMembers(event.id, session?.user?.email);
        if (!member[0]) return;
        if (member[0].role !== 1 && member[0].role !== 2) {
          toast.error("You don't have permission to access this page");
          return;
        }
        else {
          setLoadingIndex(index);
          startTransition(() => {
            router.push(href);
          });
        }
      }
      fetchMember();
    }
    else {
      const fetchMember = async () => {
        const member = await getEventMembers(event.id, session?.user?.email);
        if (!member[0]) return;
        if (index === 2 && (member[0].role === 1 || member[0].role === 2 || member[0].role === 6)) {
          toast.error("You don't have permission to access this page");
          return;
        }
        else if (index === 4 && (member[0].role === 1 || member[0].role === 2 || member[0].role === 6 || member[0].role === 4)) {
          toast.error("You don't have permission to access this page");
          return;
        }
        else {
          setLoadingIndex(index);
          startTransition(() => {
            router.push(href);
          });
        }
      }
      fetchMember();
    }

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
            <p className="text-sm flex items-center mt-2 text-[#51DACF]">
              📍 {event.venue} <br />
              {event.locationString}
            </p>
          ) : (
            <p className="text-sm flex items-center mt-2 text-[#51DACF]">
              📍 {event.venue || transWithFallback("online", "Online")}
            </p>
          )}
          <p className="text-sm flex items-center mt-3 text-[#51DACF]">
            👤 {event.role === 1 ? transWithFallback('org', 'Nhà tổ chức') : transWithFallback('member', 'Thành viên')}
          </p>
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
