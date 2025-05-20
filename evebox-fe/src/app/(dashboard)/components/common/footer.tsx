'use client';

/* Package System */
import { useTranslations } from "next-intl";
import { Icon } from '@iconify/react';

/* Package Application */
import ToggleNotification from "./toggleNotification";

const Footer = () => {
    const trans = useTranslations("common");
    return (
      <footer className="w-[100vw] bg-sky-900 text-white py-8 sm:py-12 relative left-[calc(-50vw+50%)]">
        {/* Newsletter Section */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8">Eve<span className="text-[#51DACF]">Box</span></h2>
            
          <ToggleNotification />
        </div>

        <div className="max-w-4xl mx-auto px-4 mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row justify-evenly items-start gap-12">
            <div className="text-center sm:text-left space-y-2">
              <p className="font-semibold">{trans('forCustomer') ?? "Dành cho khách hàng"}</p>
              <ul className="space-y-1">
                <li>
                  <a href="/customer-terms-of-use" className="hover:underline">
                    {trans('usageTermForCustomer') ?? "Điều khoản sử dụng cho khách hàng"}
                  </a>
                </li>
              </ul>

              <p className="font-semibold mt-4">{trans('forOrganizer') ?? "Dành cho Ban Tổ chức"}</p>
              <ul className="space-y-1">
                <li>
                  <a href="/organizer-terms-of-use" className="hover:underline">
                    {trans('usageTermForOrganizer') ?? "Điều khoản sử dụng cho ban tổ chức"}
                  </a>
                </li>
              </ul>
            </div>

            <div className="text-center sm:text-left space-y-2">
              <p className="font-semibold">{trans('aboutUs') ?? "Về chúng tôi"}</p>
              <ul className="space-y-1">
                <li><a href="/operational-regulations" className="hover:underline">{trans('operatingRegulation') ?? "Quy chế hoạt động"}</a></li>
                <li><a href="/information-privacy-policy" className="hover:underline">{trans('infoSecurityPolicy') ?? "Chính sách bảo mật thông tin"}</a></li>
                <li><a href="/dispute-settlement-policy" className="hover:underline">{trans('mechanismResolution') ?? "Cơ chế giải quyết tranh chấp/ khiếu nại"}</a></li>
                <li><a href="/payment-privacy-policy" className="hover:underline">{trans('paymentSecurityPolicy') ?? "Chính sách bảo mật thanh toán"}</a></li>
                <li><a href="/return-and-inspection-policy" className="hover:underline">{trans('returnPolicy') ?? "Chính sách đổi trả và kiểm hàng"}</a></li>
                <li><a href="/shipping-and-delivery-conditions" className="hover:underline">{trans('shippingTerm') ?? "Điều kiện vận chuyển và giao nhận"}</a></li>
                <li><a href="/payment-methods" className="hover:underline">{trans('paymentMethod') ?? "Phương thức thanh toán"}</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-8">
          <a href="#" className="no-underline	text-white over:text-teal-200"> {trans("homepageTitle")}</a>
          <a href="#" className="no-underline	text-white hover:text-teal-200">{trans("introTitle")}</a>
          <a href="#" className="no-underline	text-white hover:text-teal-200">{trans("serviceTitle")}</a>
          <a href="#" className="no-underline	text-white hover:text-teal-200">{trans("contactTitle")}</a>
          <a href="#" className="no-underline	text-white hover:text-teal-200">{trans("qaTitle")}</a>
        </div>

        {/* Divider and Bottom Section */}
        <div className="border-t-2 border-slate-400">
          <div className="max-w-6xl mx-auto px-4 pt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex gap-6">
                <a href="#" className="no-underline	text-white hover:text-teal-200">
                  <Icon icon='mdi:linkedin' width={20} height={20} />
                </a>
                <a href="#" className="no-underline	text-white hover:text-teal-200">
                  <Icon icon='mdi:instagram' width={20} height={20} />
                </a>
                <a href="#" className="no-underline	text-white hover:text-teal-200">
                  <Icon icon='mdi:facebook' width={20} height={20} />
                </a>
              </div>
              <div className="text-xs sm:text-sm">
                Non Copyrighted © 2024 Upload by EveBox
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
};

export default Footer;