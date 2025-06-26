"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Ticket, CalendarPlus, BarChart, BookMinus } from 'lucide-react';

const Sidebar = () => {
  const pathName = usePathname();
  const menuSections = [
    { text: 'Sự kiện của tôi', href: '/organizer/events', icon: <Ticket size={20} /> },
    { text: 'Quản lý báo cáo', href: '/organizer/report-management', icon: <BarChart size={20} /> },
    { text: 'Tạo sự kiện', href: '/organizer/create-event', icon: <CalendarPlus size={20} /> },
    { text: 'Điều khoản cho Ban tổ chức', href: '/organizer/legal-document', icon: <BookMinus size={20} /> },
  ];

  return (
    <div className="fixed top-0 left-0 h-full w-64 bg-sky-900 text-white p-4">
      <h2 className="text-xl font-bold mb-6 bg-gradient-to-r from-white to-[#51DACF] text-transparent bg-clip-text">ORGANIZER CENTER</h2>
      <nav>
        <ul className="space-y-3">
          {menuSections.map((item, i) => (
            <li key={i}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 py-2 px-3 rounded-md transition-colors ${
                  pathName.startsWith(item.href) ? "bg-sky-700" : "hover:bg-sky-800"
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
};

export default Sidebar;