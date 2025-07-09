"use client"

/* Package System */
import 'swiper/css';
import 'swiper/css/navigation';

/* Package Application */
import '../../../../styles/admin/pages/Dashboard.css';
import '../../../../styles/global.css';
import 'tailwindcss/tailwind.css';

import Error from 'app/(frontpage)/error';
import DashboardLoading from 'app/(frontpage)/loading';
import { useFrontDisplayEvents } from 'lib/swr/useFrontDisplayEvents';
import { useRecommendedEvents } from 'lib/swr/useRecommendedEvents';
import { CategorySpecial } from 'types/models/dashboard/frontDisplay';

import EventSlider from './eventSlider';
import ImageSlider from './imageSlider';
import SearchControls from './searchControl';
import TabSwitcher from './tabSwitcher';


const DashboardPage = () => {
  const { frontDisplayEvents, isLoading: isLoadingFrontDisplay, error: frontDisplayError } = useFrontDisplayEvents();
  const { recommendedEvents: monthlyRecommendedEvents, isLoading: isLoadingMonthly, error: monthlyError } = useRecommendedEvents('month');
  const { recommendedEvents: weeklyRecommendedEvents, isLoading: isLoadingWeekly, error: weeklyError } = useRecommendedEvents('week');

  if (isLoadingFrontDisplay || isLoadingMonthly || isLoadingWeekly) {
    return (
      <DashboardLoading></DashboardLoading>
    );
  }

  if (frontDisplayError || monthlyError || weeklyError) {
    return (
      <Error></Error>
    );
  }

  if (!frontDisplayEvents) {
    return null;
  }

  const events = {
    specialEvents: frontDisplayEvents.specialEvents || [],
    trendingEvents: frontDisplayEvents.trendingEvents || [],
    onlyOnEve: frontDisplayEvents.onlyOnEve || [],
    recommendedEvents: frontDisplayEvents.recommendedEvents || [],
    categorySpecial: frontDisplayEvents.categorySpecial as CategorySpecial[] || [],
  };

  const sliderMontlyEvents = monthlyRecommendedEvents || [];
  const sliderEvents = weeklyRecommendedEvents || [];

  let bannerEvents = frontDisplayEvents.recommendedEvents.slice(0, 5);
  if (bannerEvents.length < 5) {
    bannerEvents = frontDisplayEvents.specialEvents.slice(0, 5);
    if (bannerEvents.length < 5) {
      bannerEvents = sliderMontlyEvents.slice(0, 5);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1 mb-8">
        <div className="w-full flex justify-center flex-col items-center px-4 md:mt-8">
          <div className="w-full md:w-5/6 relative">
            <ImageSlider events={bannerEvents} />
            <SearchControls />
          </div>
        </div>

        <div className="mt-36"></div>

        {/* Events Section */}
        <div className="flex justify-center mt-8 px-4">
          <div className="w-full md:w-5/6">
              <EventSlider title="foryou" subtitle="recommendForyou" events={events.recommendedEvents} /> 
            <div className="mt-8">
              <EventSlider title="special" subtitle="specialEvent" events={events.specialEvents} />
            </div>
            <div className="mt-8">
              <EventSlider title="trending" subtitle="trendingEvent" events={events.trendingEvents} />
            </div>
            <div className="mt-8">
              <EventSlider title="onlyOnEve" subtitle="onlyOnEveEvent" events={events.onlyOnEve} showViewMore />
            </div>

            {/* Client-side TabSwitcher */}
            <TabSwitcher
              sliderEvents={sliderEvents}
              dataMonthlyRecommendedEvent={sliderMontlyEvents}
            />
            {events.categorySpecial
              ?.filter(category => category.events && category.events.length > 0)
              .map((category, index) => (
                <div key={index} className="mt-8">
                  <EventSlider title={category.category.name} events={category.events} />
                </div>
              ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;