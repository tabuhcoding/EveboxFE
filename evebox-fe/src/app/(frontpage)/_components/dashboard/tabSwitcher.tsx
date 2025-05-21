"use client";

/* Package System */
import { useState } from 'react';
import { useTranslations } from 'next-intl';

/* Package Application */
import EventSlider from './eventSlider';
import { TabSwitcherProps } from 'types/models/dashboard/dashboard.interface';
import '../../../../styles/global.css';
// import 'tailwindcss/tailwind.css';

export default function TabSwitcher({ sliderEvents, dataMonthlyRecommendedEvent }: TabSwitcherProps) {
  const [activeTab, setActiveTab] = useState('weekend');
  const trans = useTranslations('common');

  return (
    <>
      {/* Tabs */}
      <div className="flex justify-center mt-8">
        <div className="w-full  flex gap-4 border-b border-gray-600 pb-2">
          <button
            className={`px-4 py-2 text-lg font-semibold ${activeTab === 'weekend' ? 'border-b-4 border-green-500 text-black-500' : 'text-gray-400'
              }`}
            onClick={() => setActiveTab('weekend')}
          >
            {trans('weekend') ?? "Cuối tuần này"}
          </button>
          <button
            className={`px-4 py-2 text-lg font-semibold ${activeTab === 'month' ? 'border-b-4 border-green-500 text-black-500' : 'text-gray-400'
              }`}
            onClick={() => setActiveTab('month')}
          >
            {trans('month') ?? "Tháng này"}
          </button>
        </div>
      </div>
      <>
        {activeTab === 'weekend' ? (
          <EventSlider title='' events={sliderEvents} showViewMore />
        ) : (
          <EventSlider title='' events={dataMonthlyRecommendedEvent} showViewMore />
        )}
      </>
    </>
  );
};