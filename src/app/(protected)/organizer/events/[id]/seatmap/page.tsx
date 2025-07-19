/* Package Application */
import SeatMapPage from "./_components/editSeatmapPage";

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
  const { id: eventIdStr } = await params;
  const eventId = Number(eventIdStr);

  return (
    <SeatMapPage eventId={eventId} />
  )
}