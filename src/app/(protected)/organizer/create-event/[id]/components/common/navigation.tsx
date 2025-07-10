'use client';

// Package System
import { useRouter, useParams } from 'next/navigation';
import { Check } from 'lucide-react';

// Package App
import { useTranslations } from 'next-intl';

export default function Navigation({ step }: { step: number }) {
  const router = useRouter();
  const params = useParams();
  const eventId = params?.id || '';

  const t = useTranslations('common');
  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    return msg.startsWith('common.') ? fallback : msg;
  };

  const steps = [
    { number: 1, label: transWithFallback("eventInfo", "Thông tin sự kiện"), key: "info" },
    { number: 2, label: transWithFallback("timeAndTicketType", "Thời gian & loại vé"), key: "showing" },
    { number: 3, label: transWithFallback("registrationInfo", "Thông tin đăng ký"), key: "questions" },
  ];

  const handleStepClick = (targetStep: number, stepKey: string) => {
    if (targetStep <= step) {
      router.push(`/organizer/create-event/${eventId}?step=${stepKey}`);
    }
  };

  return (
    <>
      {steps.map((s, index) => {
        const isCompleted = s.number < step;
        const isActive = s.number === step;
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
