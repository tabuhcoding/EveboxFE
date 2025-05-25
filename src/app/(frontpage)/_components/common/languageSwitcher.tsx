"use client";
import Image from "next/image";
import { useI18n } from "../../../providers/i18nProvider";

export default function LanguageSwitcher() {
  const { locale, changeLanguage } = useI18n();

  return (
    <div className="absolute top-full right-0 mt-1 bg-white rounded-md shadow-lg py-1 w-32">
      <div className="relative bg-white rounded-md overflow-hidden">
        <button
          onClick={() => changeLanguage("en")}
          disabled={locale === "en"}
          className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 w-full disabled:opacity-50"
        >
          <Image src="/images/dashboard/english-icon.png" alt="English" width={28} height={28} />
          <span className="text-gray-700">English</span>
        </button>

        <button
          onClick={() => changeLanguage("vi")}
          disabled={locale === "vi"}
          className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 w-full disabled:opacity-50"
        >
          <Image src="/images/dashboard/vietnam-icon.png" alt="Vietnamese" width={28} height={28} />
          <span className="text-gray-700">Tiếng Việt</span>
        </button>
      </div>
    </div>
  );
}
