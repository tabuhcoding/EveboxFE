"use client";

/* Package System */
import React, { useState } from 'react';
import 'tailwindcss/tailwind.css';
import { Divider } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { CircularProgress } from '@mui/material';

/* Package Application */
import Navigation from '../../common/navigation';
import FormQuestionClient from './formQuestion';
import NotificationDialog from './dialog/notifiDialog';

export default function QuestionsPage() {
    const showtimes =
        typeof window !== "undefined"
            ? JSON.parse(localStorage.getItem("showtimes") || "[]")
            : [];

    const showtimeIds = showtimes.map((show: { id: string }) => show.id);
    const router = useRouter();
    const [step] = useState(3);
    const [btnValidate4, setBtnValidte4] = useState("");
    const [open, setOpen] = useState(false); //Notification Dialog 
    const [shouldProceed, setShouldProceed] = useState(false); // Trạng thái kiểm tra khi đóng Dialog
    const [isContinuing, setIsContinuing] = useState(false);

    const handleContinue = () => {
        setBtnValidte4("Continue");
        setIsContinuing(true);
        setOpen(true);
        setShouldProceed(true);
    }

    const handleNextStep = () => {
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);

        if (shouldProceed) {
            console.log("-------Here")
            router.push(`/organizer/events`);
            setShouldProceed(false);
        } else {
            setIsContinuing(false); 
        }
    };

    const t = useTranslations('common');

    const transWithFallback = (key: string, fallback: string) => {
        const msg = t(key);
        if (!msg || msg.startsWith('common.')) return fallback;
        return msg;
    };

    return (
        <>
            <div className="flex flex-col items-center justify-center p-10 relative">
                <span className="text-3xl font-semibold mb-6">{transWithFallback("registrationInfo", "Thông tin đăng ký")}</span>
                <div className="w-full flex justify-center">
                    <ol className="flex space-x-6">
                        <Navigation step={step} />

                        <div className="flex gap-4 mt-4 mb-6">
                            <button className="flex items-center justify-center gap-1 text-xs w-30 border-2 border-[#51DACF] text-[#0C4762] font-bold py-2 px-4 rounded bg-[#51DACF] hover:bg-[#0C4762] hover:border-[#0C4762] hover:text-white transition-all"
                                type="submit" form="ques-form" onClick={handleContinue} disabled={isContinuing}>
                                {isContinuing && (
                                    <CircularProgress size={16} color="inherit" aria-label="Loading" />
                                )}
                                {transWithFallback('continue', 'Tiếp tục')}
                            </button>
                        </div>
                    </ol>
                </div>

                <Divider />
            </div>

            {isContinuing && (
                <div className="fixed inset-0 bg-white/80 z-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0C4762] mx-auto"></div>
                        <p className="mt-4 text-[#0C4762]">{transWithFallback("loadingData", "Đang tải dữ liệu...")}</p>
                    </div>
                </div>
            )}

            <div className="flex justify-center">
                <FormQuestionClient onNextStep={handleNextStep} btnValidate4={btnValidate4} showingIds={showtimeIds} />
                {open && <NotificationDialog open={open} onClose={handleCloseDialog} />}
            </div>
        </>
    );
}
