/* Package System */
import 'swiper/css';
import 'swiper/css/navigation';

/* Package Application */
import '../../../../styles/admin/pages/Dashboard.css';
import '../../../../styles/global.css';
// import 'tailwindcss/tailwind.css';
import { getFrontDisplayEvents } from 'services/event.service';
import { CategorySpecial } from 'types/models/dashboard/frontDisplay';

import EventSlider from './eventSlider';
import SearchControls from './searchControl';
// import ImageSlider from './imageSlider';
// import TabSwitcher from './tabSwitcher';
// import { fetchEvents } from '../libs/server/fetchData';
// import { useFrontDisplayEvents } from '../../lib/swr/useFrontDisplayEvents';
// import { useRecommendedEvents } from '../../lib/swr/useRecommendedEvents';

const DashboardPage = async () => {
  const data = await getFrontDisplayEvents();
  // const weekTime = 'week';
  // const monthTime = 'month';
  // const dataMonthlyRecommendedEvent = await fetchRecommendEvents(monthTime);
  // const dataImageSlider = await fetchRecommendEvents(weekTime);

  const events = {
    specialEvents: data.data.specialEvents || [],
    trendingEvents: data.data.trendingEvents || [],
    onlyOnEve: data.data.onlyOnEve || [],
    categorySpecial: data.data.categorySpecial as CategorySpecial[] || [],
  };

  // const sliderMontlyEvents = dataMonthlyRecommendedEvent.data || [];
  // const sliderEvents = dataImageSlider.data || [];


  return (
    <div className="min-h-screen flex flex-col mb-8">
      <main className="flex-1">
        <div className="w-full flex justify-center flex-col items-center px-4 md:mt-8">
          <div className="w-full md:w-5/6 relative">
            {/* <ImageSlider events={sliderEvents} /> */}
            <SearchControls />
          </div>
        </div>

        <div className="mt-36"></div>

        {/* Events Section */}
        <div className="flex justify-center mt-8 px-4">
          <div className="w-full md:w-5/6">
            <EventSlider title="special" subtitle="specialEvent" events={events.specialEvents} />
            <div className="mt-8">
              <EventSlider title="trending" subtitle="trendingEvent" events={events.trendingEvents} />
            </div>
            <div className="mt-8">
              <EventSlider title="onlyOnEve" subtitle="onlyOnEveEvent" events={events.onlyOnEve} showViewMore />
            </div>

            {/* Client-side TabSwitcher */}
            {/* <TabSwitcher
              sliderEvents={sliderEvents}
              dataMonthlyRecommendedEvent={sliderMontlyEvents}
            /> */}

            {events.categorySpecial?.map((category, index) => (
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
export const dynamic = 'force-dynamic';
