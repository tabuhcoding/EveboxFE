"use client";

/* Package System */
import React from 'react';
import 'tailwindcss/tailwind.css';
import { useState } from 'react';
import { Divider } from '@nextui-org/react';
import { useRouter, useParams } from 'next/navigation';

/* Package Application */
import Navigation from '../../common/navigation';
import FormQuestionClient from './formQuestion';

interface QuestionsPageProps {
    showingIds: string[];
}

export default function QuestionsPage({ showingIds }: QuestionsPageProps) {
    const params = useParams();
    const eventId = parseInt(params?.id?.toString() || "");
    const router = useRouter();
    const [step] = useState(4);
    const [btnValidate4, setBtnValidte4] = useState("");

    const handleSave = () => {
        setBtnValidte4("Save");
    }

    const handleContinue = () => {
        setBtnValidte4("Continue");
    }

    const handleNextStep = () => {
        router.push(`/organizer/create-event/${eventId}?step=payment`);
    };

    return (
        <>
            <div className="flex flex-col items-center justify-center p-10 relative">
                <span className="text-3xl font-semibold mb-6">Thông tin đăng ký</span>
                <div className="w-full flex justify-center">
                    <ol className="flex space-x-6">
                        <Navigation step={step} />
                        <div className="flex gap-4 mt-4 mb-6">
                            <button className="text-xs w-18 border-2 border-[#0C4762] text-[#0C4762] font-bold py-2 px-4 rounded bg-white hover:bg-[#0C4762] hover:text-white transition-all"
                                type="submit" form="ques-form" onClick={handleSave}
                            >
                                Lưu
                            </button>
                        </div>

                        <div className="flex gap-4 mt-4 mb-6">
                            <button className="text-xs w-30 border-2 border-[#51DACF] text-[#0C4762] font-bold py-2 px-4 rounded bg-[#51DACF] hover:bg-[#0C4762] hover:border-[#0C4762] hover:text-white transition-all"
                                type="submit" form="ques-form" onClick={handleContinue}>
                                Tiếp tục
                            </button>
                        </div>
                    </ol>
                </div>

                <Divider />
            </div>

            <div className="flex justify-center">
                <FormQuestionClient onNextStep={handleNextStep} btnValidate4={btnValidate4} showingIds={showingIds}/>
            </div>
        </>
    );
}
