"use client";

/* Package System */
import { usePathname, useRouter } from 'next/navigation';
import { Ticket, CalendarPlus, BookMinus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState, useTransition } from 'react';
import { CircularProgress } from '@mui/material';

const Sidebar = () => {
  const pathName = usePathname();
  const t = useTranslations('common');
  const router = useRouter();

  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    if (!msg || msg.startsWith('common.')) return fallback;
    return msg;
  };

  const menuSections = [
    {
      text: transWithFallback('myEvent', 'Sự kiện của tôi'),
      href: '/organizer/events',
      icon: <Ticket size={20} />,
    },
    {
      text: transWithFallback('createEvent', 'Tạo sự kiện'),
      href: '/organizer/create-event',
      icon: <CalendarPlus size={20} />,
    },
    {
      text: transWithFallback('organizerLegalDoc', 'Điều khoản cho Ban tổ chức'),
      href: '/organizer/legal-document',
      icon: <BookMinus size={20} />,
    },
  ];

  const handleClick = (href: string, index: number) => {
    setLoadingIndex(index);
    startTransition(() => {
      router.push(href);
    });
  };

  return (
    <div className="org-sidebar fixed top-0 left-0 h-full w-64 bg-sky-900 text-white p-4">
      <h2 className="text-xl font-bold mb-6 bg-gradient-to-r from-white to-[#51DACF] text-transparent bg-clip-text">
        ORGANIZER CENTER
      </h2>
      <nav>
        <ul className="space-y-3">
          {menuSections.map((item, i) => (
            <li key={i}>
              <button
                disabled={isPending}
                onClick={() => handleClick(item.href, i)}
                className={`flex items-center gap-3 py-2 px-3 rounded-md transition-colors w-full text-left ${pathName.startsWith(item.href)
                    ? 'bg-sky-700'
                    : 'hover:bg-sky-800'
                  }`}
              >
                {loadingIndex === i && isPending ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  item.icon
                )}
                {item.text}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
