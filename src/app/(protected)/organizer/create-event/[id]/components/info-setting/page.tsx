"use client";

/* Package System */
import React,{ useState } from 'react';
import 'tailwindcss/tailwind.css';
import { Divider } from '@nextui-org/react';
import { useRouter } from 'next/navigation';

/* Package Application */
import Navigation from '../common/navigation';
import FormSettingClient from './components/formSetting';
import { SettingProps } from '../../libs/interface/idevent.interface';

export default function Setting({ eventId }: SettingProps) {
    const router = useRouter();
    const [step] = useState(3);
    const [btnValidate3, setBtnValidte3] = useState("");

    const handleSave = () => {
        setBtnValidte3("Save");
    }

    const handleContinue = () => {
        setBtnValidte3("Continue");
    }

    const handleNextStep = () => {
        router.push(`/organizer/create-event/${eventId}?step=questions`);
    };

    return (
        <>
            <div className="flex flex-col items-center justify-center p-10 relative">
                <span className="text-3xl font-semibold mb-6">Cài đặt</span>
                <div className="w-full flex justify-center">
                    <ol className="flex space-x-6">
                        <Navigation step={step} />
                        <div className="flex gap-4 mt-4 mb-6">
                            <button className="text-xs w-18 border-2 border-[#0C4762] text-[#0C4762] font-bold py-2 px-4 rounded bg-white hover:bg-[#0C4762] hover:text-white transition-all"
                                    type="submit" form="setting-form" onClick={handleSave}
                            >
                                Lưu
                            </button>
                        </div>

                        <div className="flex gap-4 mt-4 mb-6">
                            <button className="text-xs w-30 border-2 border-[#51DACF] text-[#0C4762] font-bold py-2 px-4 rounded bg-[#51DACF] hover:bg-[#0C4762] hover:border-[#0C4762] hover:text-white transition-all"
                                 type="submit" form="setting-form" onClick={handleContinue}>
                                Tiếp tục
                            </button>
                        </div>
                        </ol>
                    </div>

                <Divider />
            </div>

            <div className="flex justify-center">
                <FormSettingClient onNextStep={handleNextStep} btnValidate3={btnValidate3} />
            </div>
        </>
    );
}
