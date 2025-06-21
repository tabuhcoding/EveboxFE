"use client";

/* Package System */
import { Menu, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

/* Package Application */
import useAvatar from "app/(protected)/(user)/my-profile/_components/libs/hooks/useAvatar";
import { useUserInfo } from "lib/swr/useUserInfo";

import { useI18n } from "../../../providers/i18nProvider";
import LanguageSwitcher from "../common/languageSwitcher";

import Sidebar from "./sidebar";

const NavigationBar = () => {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { locale } = useI18n();
  const t = useTranslations("common");
  
  const { userInfo, isLoading, userInfoFetched } = useUserInfo();


  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    if (!msg || msg.startsWith('common.')) return fallback;
    return msg;
  };
  
  const avatarData = useAvatar({
    avatar_id: userInfoFetched && userInfo?.avatar_id ? userInfo.avatar_id : undefined
  });

  const imageUrl = userInfo && userInfoFetched ?
    (avatarData?.imageUrl || "/images/default_avt.png") :
    "/images/default_avt.png";
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
            <Link href={"/"} className="flex items-center gap-2 no-underline">
              <div className="w-18 h-9 rounded">
                <Image
                  src="/images/dashboard/logo-icon.png"
                  alt="logo"
                  width={30}
                  height={30}
                  priority
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
                <span className="hidden sm:inline">{transWithFallback('langCode', 'Fallback Text')}</span>
                <ChevronDown size={16} className="hidden sm:block" />
              </button>

              {isLangOpen && (
                <LanguageSwitcher />
              )}
            </div>

            {isLoading ? (
              <span className="text-white">{transWithFallback('loading', 'Đang tải')}</span>
            ) : userInfo ? (
              <div className="flex items-center">
                <h3 className="mr-2">
                  <Link href="/my-profile" className="text-white hover:text-teal-400 text-sm sm:text-base no-underline">
                    {userInfo.name}
                  </Link>
                </h3>
                <Image
                  src={imageUrl}
                  alt="avatar"
                  width={40}
                  height={40}
                  priority
                  className="w-10 h-10 rounded-full object-cover border-2 border-white hover:border-teal-300 transition-colors cursor-pointer"
                />
              </div>
            ) : (
              <div>
                <Link href="/login" style={{ textDecoration: "none" }}>
                  <button className="text-white hover:text-teal-100 text-sm sm:text-base">
                    {transWithFallback('login', 'Fallback Text')}
                  </button>
                </Link>

                <Link href="/register" style={{ textDecoration: "none" }}>
                  <button className="ml-4 bg-teal-200 text-teal-950 px-3 sm:px-4 py-2 rounded-md hover:bg-teal-50 text-sm sm:text-base">
                    {transWithFallback('register', 'Fallback Text')}
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="h-16"></div>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
};

export default NavigationBar;

