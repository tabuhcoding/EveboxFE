"use client";

import Link from 'next/link';
import { User, Ticket, Calendar, BarChart, Edit, Users, ArrowLeft, Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { SidebarProps } from '../libs/interface/organizer.interface';

const SidebarOrganizer: React.FC<SidebarProps> = ({ onClose }) => {
  const pathName = usePathname();
  const parts = pathName?.split("/");
  const eventId = parts?.[3] ?? '';

  const t = useTranslations('common');
  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    if (!msg || msg.startsWith('common.')) return fallback;
    return msg;
  };

  const menuSections = [
    {
      title: transWithFallback('report', 'Báo cáo'),
      items: [
        { text: transWithFallback('summary', 'Tổng kết'), href: `/organizer/events/${eventId}/summary-revenue`, icon: <BarChart size={18} /> },
        { text: transWithFallback('analysis', 'Phân tích'), href: `/organizer/events/${eventId}/marketing`, icon: <Ticket size={18} /> },
        { text: transWithFallback('orderList', 'Danh sách đơn hàng'), href: `/organizer/events/${eventId}/orders`, icon: <Calendar size={18} /> },
        { text: transWithFallback('checkIn', 'Check-in'), href: `/organizer/events/${eventId}/check-in`, icon: <User size={18} /> },
      ],
    },
    {
      title: transWithFallback('eventSettings', 'Cài đặt sự kiện'),
      items: [
        { text: transWithFallback('members', 'Thành viên'), href: 'member', icon: <Users size={18} /> },
        { text: transWithFallback('edit', 'Chỉnh sửa'), href: `/organizer/create-event/${eventId}?step=info`, icon: <Edit size={18} /> },
      ],
    },
    {
      title: transWithFallback('marketing', 'Marketing'),
      items: [
        { text: transWithFallback('voucher', 'Voucher'), href: `/organizer/events/${eventId}/vouchers/voucher-list`, icon: <Ticket size={18} /> },
      ],
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
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 py-2 px-3 rounded-md transition-colors ${
                      pathName === item.href ? "bg-sky-700" : "hover:bg-sky-800"
                    }`}
                  >
                    {item.icon}
                    {item.text}
                  </Link>
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
