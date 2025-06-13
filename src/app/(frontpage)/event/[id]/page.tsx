/* Package System */
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authOptions";
/* Package Application */
import { fetchRecommendEventDetail } from 'app/(frontpage)/event/[id]/_components/libs/server/fetchRecommendEventDetail'

import EventDetailClient from './_components/eventDetail';
import { fetchEventDetail } from './_components/libs/server/fetchEventDetail';

export default async function Page({ params }: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  const accessToken = session?.user?.accessToken || '';
  const { id } = await params;
  const dataEvent = await fetchEventDetail(id, accessToken);
  const event = dataEvent.data || {};
  const dataRecommendedEvents = await fetchRecommendEventDetail(id);
  const recommendedEvents = dataRecommendedEvents.data || [];

  return (
    <div>
      {<EventDetailClient event={event} recommendedEvent={recommendedEvents} />}
    </div>
  );
}

export const dynamic = 'force-dynamic';
