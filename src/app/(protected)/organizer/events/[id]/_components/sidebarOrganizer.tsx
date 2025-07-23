"use client";

/* Package System */
import Link from 'next/link';
import { User, Ticket, Calendar, BarChart, Edit, Users, ArrowLeft, Menu, Armchair } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useState, useTransition } from 'react';
import { CircularProgress } from '@mui/material';

/* Package Application */
import { SidebarProps } from '../libs/interface/organizer.interface';
import { useAuth } from '@/contexts/auth.context';
import {EventRoleItem } from '@/types/models/org/member.interface';
import { getEventMembers, getEventRoles } from '@/services/org.service';

interface MenuItem {
  text: string;
  href: string;
  icon: JSX.Element;
}

const SidebarOrganizer: React.FC<SidebarProps> = ({ onClose }) => {
  const router = useRouter();
  const pathName = usePathname();
  const parts = pathName?.split("/");
  const eventId = parts?.[3] ?? '';
  const [loadingHref, setLoadingHref] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const { session } = useAuth();
  const [rolePermission, setRolePermission] = useState<EventRoleItem>();

  useEffect(() => {
      if (!eventId) return
      const fetchMember = async () => {
        const member = await getEventMembers(parseInt(eventId), session?.user?.email);
        if (!member[0]) return;
        const roleRes = await getEventRoles();
        roleRes.forEach((role)=>{
          if (role.role===member[0].role){
              setRolePermission(role);
              return;
          }
        });
      }
      fetchMember();
  }, [eventId])

  const t = useTranslations('common');
  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    if (!msg || msg.startsWith('common.')) return fallback;
    return msg;
  };

  const handleClick = (href: string) => {
    setLoadingHref(href);
    startTransition(() => {
      router.push(href);
    });
  };

 const menuSections: { title: string; items: MenuItem[] }[] = [
  {
    title: transWithFallback('report', 'Báo cáo'),
    items: [
      rolePermission?.isSummarized && {
        text: transWithFallback('summary', 'Tổng kết'),
        href: `/organizer/events/${eventId}/summary-revenue`,
        icon: <BarChart size={18} />,
      },
      rolePermission?.marketing && {
        text: transWithFallback('analysis', 'Phân tích'),
        href: `/organizer/events/${eventId}/marketing`,
        icon: <Ticket size={18} />,
      },
      rolePermission?.viewOrder && {
        text: transWithFallback('orderList', 'Danh sách đơn hàng'),
        href: `/organizer/events/${eventId}/orders`,
        icon: <Calendar size={18} />,
      },
      rolePermission?.checkin && {
        text: transWithFallback('checkIn', 'Check-in'),
        href: `/organizer/events/${eventId}/check-in`,
        icon: <User size={18} />,
      },
      rolePermission?.isEdited && {
        text: transWithFallback("seatmap", "Sơ đồ chỗ ngồi"),
        // href: `/organizer/events/${eventId}/seatmap`,
        href: `#`,
        icon: <Armchair size={18} />
      },
    ].filter(Boolean) as MenuItem[],
  },
  {
    title: transWithFallback('eventSettings', 'Cài đặt sự kiện'),
    items: [
      rolePermission?.viewMember && {
        text: transWithFallback('members', 'Thành viên'),
        href: 'member',
        icon: <Users size={18} />,
      },
      rolePermission?.isEdited && {
        text: transWithFallback('edit', 'Chỉnh sửa'),
        href: `/organizer/create-event/${eventId}?step=info`,
        icon: <Edit size={18} />,
      },
    ].filter(Boolean) as MenuItem[],
  },
];


  return (
    <div className="top-16 left-0 h-full w-64 bg-sky-900 text-white p-4">
      <h2 className="text-xl font-bold mb-6 bg-gradient-to-r from-white to-[#51DACF] text-transparent bg-clip-text">
        ORGANIZER CENTER
      </h2>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Link href="/organizer/events">
          <ArrowLeft
            size={20}
            className="cursor-pointer hover:text-teal-400 transition"
          />
        </Link>
        <span>{transWithFallback('eventAdmin', 'Quản trị sự kiện')}</span>
        <button
          className="md:hidden top-4 right-4 p-2 bg-gray-700 rounded-md"
          onClick={onClose}
        >
          <Menu size={24} />
        </button>
      </h3>
      <nav>
        {menuSections.map((section, index) => (
          <div key={index} className="mb-4">
            <h4 className="text-sm font-bold text-teal-400 mb-2">{section.title}</h4>
            <ul className="space-y-3">
              {section.items.map((item, i) => (
                <li key={i}>
                  <button
                    onClick={() => handleClick(item.href)}
                    disabled={isPending}
                    className={`w-full text-left flex items-center gap-3 py-2 px-3 rounded-md transition-colors ${
                      pathName === item.href ? "bg-sky-700" : "hover:bg-sky-800"
                    }`}
                  >
                    {loadingHref === item.href ? (
                      <CircularProgress size={18} color="inherit" />
                    ) : (
                      item.icon
                    )}
                    {item.text}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default SidebarOrganizer;
