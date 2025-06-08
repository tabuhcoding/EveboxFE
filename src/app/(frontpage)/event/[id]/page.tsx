import { fetchRecommendEvents } from 'app/(frontpage)/_components/libs/server/fetchRecommendEvents'
import EventDetailClient from './_components/eventDetail';
import { fetchEventDetail } from './_components/libs/server/fetchEventDetail';

export default async function Page({ params }: {
   params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  console.log('event id:', id);
  const time = 'week';
  const dataEvent = await fetchEventDetail(id);
  console.log('dataEvent:', dataEvent);
  const event = dataEvent.data || {};
  console.log('event:', event);
  const dataRecommendedEvents = await fetchRecommendEvents(time);
  console.log('dataRecommendedEvents:', dataRecommendedEvents);
  const recommendedEvents = dataRecommendedEvents.data || [];
  console.log('recommendedEvents:', recommendedEvents);

  return (
    <div>
      {<EventDetailClient event={event} recommendedEvent={recommendedEvents} />}
    </div>
  );
}

export const dynamic = 'force-dynamic';
