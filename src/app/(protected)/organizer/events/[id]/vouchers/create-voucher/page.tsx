"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";

import CardSelection from "./components/cardSelection";
import BasicInfo from "./components/basicInfo";
import VoucherSettings from "./components/voucherSetting";
import ApplyScope from "./components/applyScope";
import SidebarOrganizer from "../../_components/sidebarOrganizer";

export default function Home() {
    const [voucherType, setVoucherType] = useState("single");

    // const router = useRouter();

    // const handleCancel = () => {
    //     window.history.back(); // Quay lại trang trước
    // };

    // const handleCreateVoucher = () => {
    //     // TODO: Xử lý logic tạo voucher 
    //     router.back(); 
    // };

    return (
        <main>
            <div className="flex min-h-screen bg-gray-100">
                <div className="w-64 bg-gray-900 text-white">
                    <SidebarOrganizer />
                </div>
                <div className="flex-1 p-6">
                    <div className="flex items-center gap-2">
                        <ArrowLeft size={20} className="cursor-pointer hover:text-teal-400 transition" />
                        <span className="text-lg font-bold text-[#0C4762]">Tạo voucher</span>
                    </div>
                    <div className="max-w-4xl mx-auto p-6 space-y-6">
                        <CardSelection voucherType={voucherType} setVoucherType={setVoucherType} />
                        <BasicInfo voucherType={voucherType} />
                        <VoucherSettings voucherType={voucherType} />
                        <ApplyScope />
                        {/* <div className="flex justify-end gap-4 mt-8">
                            <button className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                                onClick={handleCancel}>
                                Hủy
                            </button>
                            <button className="px-6 py-2 bg-[#0C4762] text-white rounded-lg hover:bg-[#0A374D] transition"
                                onClick={handleCreateVoucher}>
                                Tạo Voucher
                            </button>
                        </div> */}
                    </div>
                </div>
            </div>
        </main>
    );
}