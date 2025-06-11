/* Package Application */
import SelectTicketPage from "./_components/selectTicketPage";
import { fetchEventDetail } from "../../_components/libs/server/fetchEventDetail";

interface PageProps {
  params: { id: string };
  searchParams: { showingId?: string; eventId?: string, seatMapId?: number };
}

export default async function Page({ params, searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  
  const eventId = resolvedSearchParams.eventId || params.id;
  const showingId = resolvedSearchParams.showingId || "";
  const seatMapId = resolvedSearchParams.seatMapId || 0;

  const response = await fetchEventDetail(eventId);
  const event = response?.data || null;

  return (
    <SelectTicketPage
      showingId={showingId}
      serverEvent={event}
      seatMapId={seatMapId}
    />
  );
}