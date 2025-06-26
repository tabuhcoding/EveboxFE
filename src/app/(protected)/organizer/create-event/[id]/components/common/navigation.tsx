'use client';

//Package System
import { useRouter, useParams} from 'next/navigation';
import { Check } from 'lucide-react';

//Package App

export default function Navigation({ step }: { step: number }) {
    const router = useRouter();
    const params = useParams();
    const eventId = params?.id || '';
    // const eventId = 1; //Gán cứng tạm thời

    const steps = [
        { number: 1, label: "Thông tin sự kiện", key: "info" },
        { number: 2, label: "Thời gian & loại vé", key: "showing" },
        // { number: 3, label: "Cài đặt", key: "setting" },
        { number: 3, label: "Thông tin đăng ký", key: "questions" },
    ];

    const handleStepClick = (targetStep: number, stepKey: string) => {
        if (targetStep <= step) {
            router.push(`/organizer/create-event/${eventId}?step=${stepKey}`);
        }
    };

    return (
        <>
            {/* Stepper */}
            {steps.map((s, index) => {
                const isCompleted = s.number < step; // Bước đã hoàn thành
                const isActive = s.number === step; // Kiểm tra bước hiện tại
                return (
                    <li
  key={index}
  className={`flex items-center space-x-2.5 transition-colors duration-200
              ${isActive ? 'text-black-600' : 'text-gray-500'} 
              ${s.number <= step ? 'cursor-pointer hover:text-[#51DACF] hover:font-semibold' : 'cursor-not-allowed'}`}
  onClick={() => handleStepClick(s.number, s.key)}
>
                        <span className={`text-xs mb-2 flex items-center justify-center w-8 h-8 border rounded-full 
                                    ${isActive ? 'border-[#51DACF] bg-[#51DACF] text-white' : 'border-gray-500'}
                                    ${isCompleted ? 'border-green-500 bg-green-100 text-green-600' : ''}`}>

                            {isCompleted ? <Check size={20} color="green" /> : s.number}
                        </span>

                        {/* Title + underline */}
                        <div className="relative flex flex-col items-center">
                            <span className="text-xs font-medium leading-tight mb-2">{s.label}</span>

                            {isActive && (
                                <div className="absolute left-0 bottom-[-6px] w-full h-1 bg-[#51DACF]"></div>
                            )}
                        </div>
                    </li>
                );
            })}
        </>
    );
}
