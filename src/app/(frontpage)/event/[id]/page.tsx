/* Package Application */
import { fetchRecommendEvents } from 'app/(frontpage)/_components/libs/server/fetchRecommendEvents'
import EventDetailClient from './_components/eventDetail';
import { fetchEventDetail } from './_components/libs/server/fetchEventDetail';

export default async function Page({ params }: {
   params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const time = 'week';
  const dataEvent = await fetchEventDetail(id);
  const event = dataEvent.data || {};
  const dataRecommendedEvents = await fetchRecommendEvents(time);
  const recommendedEvents = dataRecommendedEvents.data || [];

  return (
    <div>
      {<EventDetailClient event={event} recommendedEvent={recommendedEvents} />}
    </div>
  );
}

export const dynamic = 'force-dynamic';
