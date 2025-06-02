'use client';

/* Package System */
import { Menu, ChevronDown, User2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

/* Package Application */
import { useI18n } from "app/providers/i18nProvider";
import { gatewayService } from "services/instance.service";
import { UserInfo, UserInfoResponse } from "types/models/dashboard/user.interface";

import LanguageSwitcher from "./languageSwitcher";
import Sidebar from "./sidebar";


const NavigationBar = () => {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null); // Replace `any` with a proper type if known
  const [isLoading, setLoading] = useState(false);
  const { data: session } = useSession();
  const { locale } = useI18n(); // Get current locale
  const trans = useTranslations("common");

  useEffect(() => {
    // Fetch user info when the component mounts
    const fetchUserInfo = async () => {
      setLoading(true);
      try {
        const response = await gatewayService.get<UserInfoResponse>("/api/user/me"); // Assuming your API route is /api/me
        setUserInfo(response.data.data);
        if (response?.data?.data?.name) {
          localStorage.setItem("name", response.data.data.name);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if session exists
    if (session?.user?.accessToken) {
      fetchUserInfo();
    } else {
      setUserInfo(null);
    }
  }, [session]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-sky-900 shadow-lg z-50">
        <div className="w-full px-4 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <button
              className="text-white p-2 hover:bg-teal-700 rounded-md"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <Link href={"/"} className="flex items-center gap-2">
              <div className="w-18 h-9 rounded">
                <Image
                  src="/images/dashboard/logo-icon.png"
                  alt="logo"
                  width={30} // Adjust as needed
                  height={30} // Adjust as needed
                  priority // Ensures the logo loads fast
                />

              </div>
              <span className="text-white font-bold text-xl hidden sm:inline">
                EveBox
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative z-50">
              <button
                className="flex items-center gap-1 sm:gap-2 text-white p-2 hover:bg-teal-700 rounded-md"
                onClick={() => setIsLangOpen(!isLangOpen)}
              >
                <Image src={locale === "vi" ? "/images/dashboard/vietnam-icon.png" : "/images/dashboard/english-icon.png"} alt="flag" width={28} height={28} />
                <span className="hidden sm:inline">{trans("angCode") || "VI"}</span>
                <ChevronDown size={16} className="hidden sm:block" />
              </button>

              {isLangOpen && (
                <LanguageSwitcher />
              )}
            </div>

            {isLoading ? (
              <span className="text-white">{trans("loading") ?? 'Đang tải'}</span>
            ) : userInfo ? (
              <div className="flex items-center">
                <h3 className="mr-2">
                  <Link href="/my-profile" className="text-white hover:text-teal-400 text-sm sm:text-base">
                    {userInfo.name}
                  </Link>
                </h3>
                <User2Icon className="bg-white rounded-full" size={24} />
              </div>
            ) : (
              <div>
                <Link href="/login" style={{ textDecoration: "none" }}>
                  <button className="text-white hover:text-teal-100 text-sm sm:text-base">
                    {trans("login") || "Đăng nhập"}
                  </button>
                </Link>

                <Link href="/register" style={{ textDecoration: "none" }}>
                  <button className="ml-4 bg-teal-200 text-teal-950 px-3 sm:px-4 py-2 rounded-md hover:bg-teal-50 text-sm sm:text-base">
                    {trans("register") || "Đăng ký"}
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Add a spacer to prevent content from hiding behind the fixed navbar */}
      <div className="h-16"></div>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
};

export default NavigationBar;