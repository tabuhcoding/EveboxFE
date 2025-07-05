'use client'

/* Package System */
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { Icon } from "@iconify/react";
import { useTranslations } from "next-intl";

interface GeneralTermsDialogProps {
    open: boolean;
    onClose: () => void;
}

export default function GeneralTermsDialog({ open, onClose }: GeneralTermsDialogProps) {
    const t = useTranslations("common");

    const transWithFallback = (key: string, fallback: string) => {
        const msg = t(key);
        if (!msg || msg.startsWith('common.')) return fallback;
        return msg;
    };

    const terms = [
        {
            label: transWithFallback("usageTermForCustomer", "Điều khoản sử dụng cho khách hàng"),
            href: "/files/DieuKhoanSuDung.pdf"
        },
        {
            label: transWithFallback("operatingRegulation", "Quy chế hoạt động"),
            href: "/files/1.1+Quy+che_Website.pdf"
        },
        {
            label: transWithFallback("infoSecurityPolicy", "Chính sách bảo mật thông tin"),
            href: "/files/2.Chinh_sach_bao_mat_thong_tin.pdf"
        },
        {
            label: transWithFallback("mechanismResolution", "Cơ chế giải quyết tranh chấp/ khiếu nại"),
            href: "/files/3.Co-che-giai-quyet-tranh-chap-khieu-nai.pdf"
        },
        {
            label: transWithFallback("paymentSecurityPolicy", "Chính sách bảo mật thanh toán"),
            href: "/files/4.Evebox_Chinh+sach+bao+mat+thanh+toan.pdf"
        },
        {
            label: transWithFallback("returnPolicy", "Chính sách đổi trả và kiểm hàng"),
            href: "/files/5.Evebox_Chinh+sach+doi+tra+va+kiem+hang.pdf"
        },
        {
            label: transWithFallback("shippingTerm", "Điều kiện vận chuyển và giao nhận"),
            href: "/files/6.Evetbox_Dieu+kien+van+chuyen+va+giao+nhan.pdf"
        },
        {
            label: transWithFallback("paymentMethod", "Phương thức thanh toán"),
            href: "/files/7.Phuong_thuc_thanh_toan.pdf"
        }
    ];

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            {/* Header */}
            <div className="text-white dialog-header px-6 py-3 justify-center items-center flex relative" style={{ background: '#0C4762' }}>
                <DialogTitle className="!m-0 !p-0 text-lg text-center font-bold w-full">
                    {transWithFallback("generalTerms", "Điều Kiện Giao Dịch Chung")}
                </DialogTitle>
                <button onClick={onClose} className="absolute right-2 top-2 p-1 rounded-full transition-colors hover:bg-white/20 group">
                    <Icon icon="ic:baseline-close" width="20" height="20" className="text-white group-hover:text-gray-200"/>
                </button>
            </div>

            {/* Content */}
            <DialogContent className="p-4">
                <ul className="space-y-1 text-left text-base">
                    {terms.map((item, index) => (
                        <li
                            key={index}
                            className="border-b py-2 hover:underline cursor-pointer"
                        >
                            <a
                                href={item.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex justify-between items-center text-black no-underline"
                            >
                                <span>{item.label}</span>
                                <Icon icon="ic:round-arrow-forward-ios" width="16" color="#999" />
                            </a>
                        </li>
                    ))}
                </ul>
            </DialogContent>
        </Dialog>
    );
}
