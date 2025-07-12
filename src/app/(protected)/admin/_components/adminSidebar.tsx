'use client';

/* Package System */
import Link from "next/link";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { CalendarPlus, UserRoundCog, Ticket, FilePenLine, MapPin, CircleDollarSign, ChartColumnIncreasing } from 'lucide-react';

export default function AdminSidebar() {
  const t = useTranslations('common');
  const pathName = usePathname();

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    if (!msg || msg.startsWith('common.')) return fallback;
    return msg;
  };

  const menuSections = [
    { text: transWithFallback('accountManagement', 'Quản lý tài khoản'), href: '/admin/account-management', icon: <UserRoundCog size={20} /> },
    { text: transWithFallback('eventManagement', 'Quản lý sự kiện'), href: '/admin/event-management', icon: <CalendarPlus size={20} /> },
    { text: transWithFallback('showingManagement', 'Quản lý suất diễn'), href: '/admin/showing-management', icon: <Ticket size={20} /> },
    { text: transWithFallback('eventSpecialManagement', 'Quản lý sự kiện đặc biệt'), href: '/admin/event-special-management', icon: <FilePenLine size={20} /> },
    { text: transWithFallback('locationManagement', 'Quản lý địa điểm'), href: '/admin/location-management', icon: <MapPin size={20} /> },
    // { text: 'Quản lý Voucher', href: '/admin/voucher-management', icon: <TicketPercent size={20} /> },
    { text: transWithFallback('paymentManagement', 'Quản lý thanh toán'), href: 'https://my.payos.vn/login', icon: <CircleDollarSign size={20} /> },
    { text: transWithFallback('revenueManagement', 'Quản lý doanh thu'), href: '/admin/revenue-management', icon: <ChartColumnIncreasing size={20} /> },
  ];

  return (
    <div className="fixed top-0 left-0 h-full w-64 bg-sky-900 text-white p-4">
      <h2 className="text-xl font-bold mb-6 bg-gradient-to-r from-white to-[#51DACF] text-transparent bg-clip-text">ADMIN CENTER</h2>
      <nav>
        <ul className="space-y-3">
          {menuSections.filter(item => item.href).map((item, i) => (
            <li key={i}>
              <Link
                href={item.href as string}
                className={`flex items-center gap-3 py-2 px-3 rounded-md transition-colors text-white no-underline ${
                  pathName === item.href ? "bg-sky-700" : "hover:bg-sky-800"
                }`}
              >
                {item.icon}
                {item.text}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}