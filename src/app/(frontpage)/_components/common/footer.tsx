"use client"

/* Package System */
import { Linkedin, Instagram, Facebook } from 'lucide-react';
import { useTranslations } from "next-intl";
import 'tailwindcss/tailwind.css';

/* Package Application */
import ToggleNotification from './toggleNotification';

const Footer = () => {
    const t = useTranslations("common");
    return (
      <footer className="w-[100vw] bg-sky-900 text-white py-8 sm:py-12 relative left-[calc(-50vw+50%)]">
        {/* Newsletter Section */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8">Eve<span className="text-[#51DACF]">Box</span></h2>
            
          <ToggleNotification />
        </div>

        <div className="max-w-4xl mx-auto px-4 mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row justify-evenly items-start gap-12">
            <div className="text-left space-y-2">
              <p className="font-semibold">Dành cho khách hàng</p>
              <ul className="space-y-1 list-none p-0">
                <li>
                  <a href="/customer-terms-of-use" className="text-white no-underline hover:underline">
                    Điều khoản sử dụng cho khách hàng
                  </a>
                </li>
              </ul>

              <p className="font-semibold mt-4">Dành cho Ban Tổ chức</p>
              <ul className="space-y-1 list-none p-0">
                <li>
                  <a href="/organizer-terms-of-use" className="text-white no-underline hover:underline">
                    Điều khoản sử dụng cho ban tổ chức
                  </a>
                </li>
              </ul>
            </div>

            <div className="text-left space-y-2">
              <p className="font-semibold">Về chúng tôi</p>
              <ul className="space-y-1 list-none p-0">
                <li><a href="/operational-regulations" className="text-white no-underline hover:underline">Quy chế hoạt động</a></li>
                <li><a href="/information-privacy-policy" className="text-white no-underline hover:underline">Chính sách bảo mật thông tin</a></li>
                <li><a href="/dispute-settlement-policy" className="text-white no-underline hover:underline">Cơ chế giải quyết tranh chấp/ khiếu nại</a></li>
                <li><a href="/payment-privacy-policy" className="text-white no-underline hover:underline">Chính sách bảo mật thanh toán</a></li>
                <li><a href="/return-and-inspection-policy" className="text-white no-underline hover:underline">Chính sách đổi trả và kiểm hàng</a></li>
                <li><a href="/shipping-and-delivery-conditions" className="text-white no-underline hover:underline">Điều kiện vận chuyển và giao nhận</a></li>
                <li><a href="/payment-methods" className="text-white no-underline hover:underline">Phương thức thanh toán</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-8">
          <a href="#" className="no-underline	text-white over:text-teal-200"> {t("homepageTitle")}</a>
          <a href="#" className="no-underline	text-white hover:text-teal-200">{t("introTitle")}</a>
          <a href="#" className="no-underline	text-white hover:text-teal-200">{t("serviceTitle")}</a>
          <a href="#" className="no-underline	text-white hover:text-teal-200">{t("contactTitle")}</a>
          <a href="#" className="no-underline	text-white hover:text-teal-200">{t("qaTitle")}</a>
        </div>

        {/* Divider and Bottom Section */}
        <div className="border-t-2 border-slate-400">
          <div className="max-w-6xl mx-auto px-4 pt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex gap-6">
                <a href="#" className="no-underline	text-white hover:text-teal-200">
                  <Linkedin size={20} />
                </a>
                <a href="#" className="no-underline	text-white hover:text-teal-200">
                  <Instagram size={20} />
                </a>
                <a href="#" className="no-underline	text-white hover:text-teal-200">
                  <Facebook size={20} />
                </a>
              </div>
              <div className="text-xs sm:text-sm">
                Non Copyrighted © 2025.7 Upload by EveBox
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
};

export default Footer;