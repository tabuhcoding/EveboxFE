/* Package Application */
import EventDetailPage from "./_components/eventDetailPage";

interface Props {
  params: Promise<{
    id: string;
  }>
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  
  return (
    <EventDetailPage eventId={parseInt(id)} />
  )
}