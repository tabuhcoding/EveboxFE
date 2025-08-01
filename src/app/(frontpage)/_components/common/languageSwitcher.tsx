"use client";
import Image from "next/image";

import { useI18n } from "../../../providers/i18nProvider";

export default function LanguageSwitcher() {
  const { locale, changeLanguage } = useI18n();

  return (
    <div className="absolute top-full right-0 bg-white rounded-md shadow-lg w-36">
      <div className="relative bg-white rounded-md overflow-hidden">
        <button
          onClick={() => changeLanguage("en")}
          disabled={locale === "en"}
          className={`flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-white hover:bg-teal-600 hover:opacity-50 w-full disabled:bg-teal-600 disabled:text-white`}
        >
          <Image src="/images/dashboard/english-icon.png" alt="English" width={28} height={28} />
          <span className="">English</span>
        </button>

        <button
          onClick={() => changeLanguage("vi")}
          disabled={locale === "vi"}
          className={`flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-white hover:bg-teal-600 hover:opacity-50 disabled:bg-teal-600 disabled:text-white w-full`}
        >
          <Image src="/images/dashboard/vietnam-icon.png" alt="Vietnamese" width={28} height={28} />
          <span className="">Tiếng Việt</span>
        </button>
      </div>
    </div>
  );
}
