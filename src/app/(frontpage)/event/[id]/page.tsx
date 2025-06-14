/* Package System */
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authOptions";
/* Package Application */
import { fetchRecommendEventDetail } from 'app/(frontpage)/event/[id]/_components/libs/server/fetchRecommendEventDetail'
import { ReactScan } from "components/reactScan";

import EventDetailClient from './_components/eventDetail';
import { fetchEventDetail } from './_components/libs/server/fetchEventDetail';

export default async function Page({ params }: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  const { id } = await params;
  const dataEvent = await fetchEventDetail(id, session?.user?.accessToken);
  const event = dataEvent.data || {};
  const dataRecommendedEvents = await fetchRecommendEventDetail(id);
  const recommendedEvents = dataRecommendedEvents.data || [];

  return (
    <>
      <ReactScan />
      {<EventDetailClient event={event} recommendedEvent={recommendedEvents} />}
    </>
  );
}

