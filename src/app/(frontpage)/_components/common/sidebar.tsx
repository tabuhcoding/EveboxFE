"use client"

/* Package System */
import { User, Ticket, Calendar, LogOut, Lock, Menu, ShieldUser } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from "next-intl";
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';

/* Package Application */
import { useAuth } from 'contexts/auth.context';
import { getOrgPaymentInfo } from 'services/org.service';
import OrganizerRegistrationPopup from "../../../(protected)/(user)/my-profile/_components/orgRegisterPopup"; // Adjust path if needed

import { SidebarProps } from '../libs/interface/dashboard.interface';

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const t = useTranslations("common");

  const [showPaymentWarning, setShowPaymentWarning] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const [showOrgRegisterPopup, setShowOrgRegisterPopup] = useState(false);

  const handleLogout = async () => {
    if (!isAuthenticated) {
      console.error('User not authenticated');
      return;
    }

    setLoading(true);
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProtectedClick = async (href: string) => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
    } else {
      if (href === '/organizer/create-event') {
        try {
          const res = await getOrgPaymentInfo();
          if (!res) {
            // Show dialog
            setPendingNavigation(href);
            setShowPaymentWarning(true);
            return;
          }
          else {
            localStorage.setItem("isRegisterPayment", "true");
          }
        } catch (err) {
          console.error("Failed to check organizer payment info:", err);
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

  const menuItems = useMemo(() => {
    const items = [
      { icon: <User size={20} />, text: t("accountManagement"), onClick: () => handleProtectedClick('/my-profile') },
      { icon: <Ticket size={20} />, text: t("ticketManagement"), onClick: () => handleProtectedClick('/my-ticket') },
      { icon: <Calendar size={20} />, text: t("createEvent"), onClick: () => handleProtectedClick('/organizer/create-event') },
      { icon: <Lock size={20} />, text: t("changePassword"), onClick: () => handleProtectedClick('/change-password') },
    ];

    if (user?.role === 1) {
      items.unshift({
        icon: <ShieldUser size={20} />,
        text: t("goToAdmin"),
        onClick: async () => {
          router.push('/admin/account-management');
        },
      });
    }

    if (user) {
      items.push({
        icon: <LogOut size={20} />,
        text: t("logout"),
        onClick: handleLogout,
      });
    }

    return items;
  }, [user, t, handleLogout, router]);

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
                  {/* {item.href ? (
                    <Link
                      href={item.href}
                      className="no-underline text-white flex items-center gap-3 py-2 px-3 sm:px-4 hover:bg-sky-800 rounded-md transition-colors text-sm sm:text-base"
                    >
                      {item.icon}
                      <span>{item.text}</span>
                    </Link>
                  ) : (
                    <button
                      onClick={item.onClick}
                      disabled={loading}
                      className="no-underline text-white flex items-center gap-3 py-2 px-3 sm:px-4 hover:bg-sky-800 rounded-md transition-colors text-sm sm:text-base"
                    >
                      {item.icon}
                      <span>{item.text}</span>
                    </button>
                  )} */}
                  {item.onClick ? (
                    <button
                      onClick={item.onClick}
                      disabled={loading}
                      className="no-underline text-white flex items-center gap-3 py-2 px-3 sm:px-4 hover:bg-sky-800 rounded-md transition-colors text-sm sm:text-base w-full text-left"
                    >
                      {item.icon}
                      <span>{item.text}</span>
                    </button>
                  ) : null}
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
                  setShowPaymentWarning(false);
                  localStorage.setItem("isRegisterPayment", "false");
                  if (pendingNavigation) window.location.href = pendingNavigation;
                }}
                className="px-4 py-2 bg-teal-500 text-white rounded"
              >
                {transWithFallback("continueAnyway", "Tiếp tục tạo sự kiện")}
              </button>
              <button
                onClick={() => {
                  setShowPaymentWarning(false);
                  setShowOrgRegisterPopup(true);
                }}
                className="px-4 py-2 bg-gray-300 rounded w-full"
              >
                {transWithFallback("registerOrganizer", "Đăng ký tổ chức")}
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
