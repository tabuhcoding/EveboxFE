/* Package Application */
import EventDetailPage from "./_components/eventDetail";

interface Props {
  params: Promise<{
    eventId: string;
  }>
}

export default async function Page({ params }: Props) {
  const { eventId } = await params;
  
  return (
    <EventDetailPage eventId={eventId} />
  )
}