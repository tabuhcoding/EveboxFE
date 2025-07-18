"use client"

/* Package System */
import { User, Ticket, Calendar, LogOut, Lock, Menu, ShieldUser, BookOpenText } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from "next-intl";
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { CircularProgress } from '@mui/material';

/* Package Application */
import { useAuth } from 'contexts/auth.context';
import OrganizerRegistrationPopup from "../../../(protected)/(user)/my-profile/_components/orgRegisterPopup"; // Adjust path if needed

import { SidebarProps } from '../libs/interface/dashboard.interface';
import { getCurrentUser } from '@/services/auth.service';
import { MenuItem } from '../libs/interface/dashboard.interface';

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { user } = useAuth();
  const router = useRouter();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const t = useTranslations("common");

  const [showPaymentWarning, setShowPaymentWarning] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const [showOrgRegisterPopup, setShowOrgRegisterPopup] = useState(false);
  const [loadingContinue, setLoadingContinue] = useState(false);
  const [loadingRegister, setLoadingRegister] = useState(false);
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);

  const handleLogout = async (index: number) => {
    if (!isAuthenticated) {
      menuItems
      console.error('User not authenticated');
      return;
    }

    setLoadingIndex(index);
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoadingIndex(null);
    }
  };

  const handleProtectedClick = async (
    href: string,
    setLoadingIndex: (i: number | null) => void,
    index: number) => {
    setLoadingIndex(index);

    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      setLoadingIndex(null);
    } else {
      if (href === '/organizer/create-event') {
        try {
          const res = await getCurrentUser();
          if (res.role !== 1 && res.role !== 2) {
            // Show dialog
            setPendingNavigation(href);
            setShowPaymentWarning(true);
            setLoadingIndex(null);
            return;
          }
          else {
            localStorage.setItem("isRegisterPayment", "true");
          }
        } catch (err) {
          console.error("Failed to check organizer payment info:", err);
          setLoadingIndex(null);
          // Optionally show an error dialog
          return;
        }
      }
      window.location.href = href;
    }
  };

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    if (!msg || msg.startsWith('common.')) return fallback;
    return msg;
  };

  const menuItems: MenuItem[] = useMemo(() => {
    const items: MenuItem[] = [
      { icon: <User size={20} />, text: t("accountManagement"), href: '/my-profile' },
      { icon: <Ticket size={20} />, text: t("ticketManagement"), href: '/my-ticket' },
      { icon: <Calendar size={20} />, text: t("createEvent"), href: '/organizer/create-event' },
      { icon: <Lock size={20} />, text: t("changePassword"), href: '/change-password' },
    ];

    if (user?.role === 1) {
      items.unshift({
        icon: <ShieldUser size={20} />,
        text: t("goToAdmin"),
        href: '/admin/account-management',
      });
    }

    items.push({
      icon: <BookOpenText size={20} />,
      text: t("instructionManual"),
      href: '/instruction',
    });

    if (user) {
      items.push({
        icon: <LogOut size={20} />,
        text: t("logout"),
        onClick: () => { },
      });
    }

    return items;
  }, [user, t, logout, router]);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              onClose();
            }
          }}
        />
      )}


      <div
        className={`fixed top-0 left-0 h-full w-64 sm:w-72 bg-sky-900 text-white transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="p-4">
          <div className='flex flex-row justify-between items-center'>
            <h2 className="text-xl sm:text-2xl font-bold m-0 p-0">{t("sidebarTitle") || "Fallback Text"}</h2>
            <button
              className="text-white p-2 hover:bg-teal-700 rounded-md"
              onClick={onClose}
            >
              <Menu size={24} />
            </button>
          </div>
          <nav>
            <ul className="space-y-3 sm:space-y-4">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <button
                    onClick={async () => {
                      setLoadingIndex(index);
                      try {
                        if (item.href) {
                          await handleProtectedClick(item.href, setLoadingIndex, index);
                        } else if (item.text === t("logout")) {
                          await handleLogout(index);
                        } else if (item.onClick) {
                          await item.onClick();
                        }
                      } catch (e) {
                        console.error(e);
                        setLoadingIndex(null);
                      }
                    }}
                    disabled={loadingIndex !== null}
                    className="no-underline text-white flex items-center gap-3 py-2 px-3 sm:px-4 hover:bg-sky-800 rounded-md transition-colors text-sm sm:text-base w-full text-left"
                  >
                    {loadingIndex === index ? (
                      <CircularProgress size={18} color="inherit" />
                    ) : (
                      <>
                        {item.icon}
                      </>
                    )}
                    <span>{item.text}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {showLoginPrompt && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-[999]">
          <div className="bg-white text-black p-6 rounded-md shadow-lg w-[90%] max-w-sm">
            <p className="text-base sm:text-lg">{transWithFallback("pleaseLogin", "Vui lòng đăng nhập!")}</p>
            <div className="mt-4 flex justify-end space-x-2">
              <Link href="/login" style={{ textDecoration: "none" }}>
                <button className=" px-4 py-2 bg-teal-300 rounded">
                  {transWithFallback('login', 'Đăng nhập')}
                </button>
              </Link>
              <button onClick={() => setShowLoginPrompt(false)} className="px-4 py-2 bg-gray-300 rounded">{transWithFallback('btnCancel', 'Hủy')}</button>
            </div>
          </div>
        </div>
      )}

      {showPaymentWarning && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-[999]">
          <div className="bg-white text-black p-6 rounded-md shadow-lg w-[90%] max-w-sm">
            <p className="text-base sm:text-lg">
              {transWithFallback("noPaymentInfo", "Bạn chưa đăng ký thông tin thanh toán với tư cách tổ chức.")}
            </p>
            <div className="mt-4 flex flex-col space-y-2">
              <button
                onClick={() => {
                  setLoadingContinue(true);
                  setShowPaymentWarning(false);
                  localStorage.setItem("isRegisterPayment", "false");
                  if (pendingNavigation) window.location.href = pendingNavigation;
                }}
                disabled={loadingContinue}
                className="px-4 py-2 bg-teal-500 text-white rounded flex items-center justify-center gap-1"
              >
                {loadingContinue ? (
                  <CircularProgress size={16} />
                ) : (
                  transWithFallback("continueAnyway", "Tiếp tục tạo sự kiện")
                )}
              </button>
              <button
                onClick={() => {
                  setLoadingRegister(true);
                  setShowPaymentWarning(false);
                  setShowOrgRegisterPopup(true);
                }}
                className="px-4 py-2 bg-gray-300 rounded w-full flex items-center justify-center gap-1"
                disabled={loadingRegister}
              >
                {loadingRegister ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  transWithFallback("registerOrganizer", "Đăng ký tổ chức")
                )}
              </button>
              <button
                onClick={() => setShowPaymentWarning(false)}
                className="px-4 py-2 bg-red-100 text-red-600 rounded"
              >
                {transWithFallback("btnCancel", "Hủy")}
              </button>
            </div>
          </div>
        </div>
      )}

      {showOrgRegisterPopup && (
        <OrganizerRegistrationPopup
          onClose={() => setShowOrgRegisterPopup(false)}
          onSuccess={() => {
            setShowOrgRegisterPopup(false);
            localStorage.setItem("isRegisterPayment", "true");
            if (pendingNavigation) window.location.href = pendingNavigation;
          }}
        />
      )}
    </>
  );
};

export default Sidebar;
