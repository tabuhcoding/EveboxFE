"use client"

/* Package System */
import { Linkedin, Instagram, Facebook } from 'lucide-react';
import { useTranslations } from "next-intl";
import 'tailwindcss/tailwind.css';

/* Package Application */
import ToggleNotification from './toggleNotification';

const Footer = () => {
  const t = useTranslations("common");

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    if (!msg || msg.startsWith('common.')) return fallback;
    return msg;
  }

  return (
    <footer className="w-[100vw] bg-sky-900 text-white py-8 sm:py-12 relative left-[calc(-50vw+50%)]">
      {/* Newsletter Section */}
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8">Eve<span className="text-[#51DACF]">Box</span></h2>

        <ToggleNotification />
      </div>

      <div className="max-w-4xl mx-auto px-4 mb-8 sm:mb-12">
        <div className="flex flex-col sm:flex-row justify-evenly items-start gap-12">
          <div className="text-left text-teal-300 space-y-2">
            <p className="font-semibold">{transWithFallback("forCustomer", "Dành cho khách hàng")}</p>
            <ul className="space-y-1 list-none p-0">
              <li>
                <a href="/files/DieuKhoanSuDung.pdf"
                  target="_blank"
                  rel="noopener noreferrer" className="text-white no-underline hover:underline">
                  {transWithFallback("usageTermForCustomer", "Điều khoản sử dụng cho khách hàng")}
                </a>
              </li>
            </ul>

            <p className="font-semibold mt-4">{transWithFallback("forOrganizer", "Dành cho Ban Tổ chức")}</p>
            <ul className="space-y-1 list-none p-0">
              <li>
                <a href="/files/8.1Evebox_Dieu+khoan+su+dung+ap+dung+doi+BTC.pdf"
                  target="_blank"
                  rel="noopener noreferrer" className="text-white no-underline hover:underline">
                  {transWithFallback("usageTermForOrganizer", "Điều khoản sử dụng cho ban tổ chức")}
                </a>
              </li>
            </ul>
          </div>

          <div className="text-left space-y-2 text-teal-300">
            <p className="font-semibold">{transWithFallback("aboutUs", "Về chúng tôi")}</p>
            <ul className="space-y-1 list-none p-0">
              <li><a href="/files/1.1+Quy+che_Website.pdf"
                target="_blank"
                rel="noopener noreferrer" className="text-white no-underline hover:underline">{transWithFallback("operatingRegulation", "Quy chế hoạt động")}</a></li>
              <li><a href="/files/2.Chinh_sach_bao_mat_thong_tin.pdf"
                target="_blank"
                rel="noopener noreferrer" className="text-white no-underline hover:underline">{transWithFallback("infoSecurityPolicy", "Chính sách bảo mật thông tin")}</a></li>
              <li><a href="/files/3.Co-che-giai-quyet-tranh-chap-khieu-nai.pdf"
                target="_blank"
                rel="noopener noreferrer" className="text-white no-underline hover:underline">{transWithFallback("mechanismResolution", "Cơ chế giải quyết tranh chấp/ khiếu nại")}</a></li>
              <li><a href="/files/4.Evebox_Chinh+sach+bao+mat+thanh+toan.pdf"
                target="_blank"
                rel="noopener noreferrer" className="text-white no-underline hover:underline">{transWithFallback("paymentSecurityPolicy", "Chính sách bảo mật thanh toán")}</a></li>
              <li><a href="/files/5.Evebox_Chinh+sach+doi+tra+va+kiem+hang.pdf"
                target="_blank"
                rel="noopener noreferrer" className="text-white no-underline hover:underline">{transWithFallback("returnPolicy", "Chính sách đổi trả và kiểm hàng")}</a></li>
              <li><a href="/files/6.Evetbox_Dieu+kien+van+chuyen+va+giao+nhan.pdf"
                target="_blank"
                rel="noopener noreferrer" className="text-white no-underline hover:underline">{transWithFallback("shippingTerm", "Điều kiện vận chuyển và giao nhận")}</a></li>
              <li><a href="/files/7.Phuong_thuc_thanh_toan.pdf"
                target="_blank"
                rel="noopener noreferrer" className="text-white no-underline hover:underline">{transWithFallback("paymentMethod", "Phương thức thanh toán")}</a></li>
            </ul>
          </div>
        </div>
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
              Non Copyrighted © 2025.26 Upload by EveBox
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;