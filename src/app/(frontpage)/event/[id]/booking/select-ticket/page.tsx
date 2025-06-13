/* Package System */
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authOptions";

/* Package Application */
import { fetchEventDetail } from "../../_components/libs/server/fetchEventDetail";

import SelectTicketPage from "./_components/selectTicketPage";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ showingId?: string; eventId?: string, seatMapId?: number }>;
}

export default async function Page({ params, searchParams }: PageProps) {
  const session = await getServerSession(authOptions);
  const accessToken = session?.user?.accessToken;

  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const eventId = resolvedSearchParams.eventId || resolvedParams.id;
  const showingId = resolvedSearchParams.showingId || "";
  const seatMapId = resolvedSearchParams.seatMapId || 0;

  const response = await fetchEventDetail(eventId, accessToken);
  const event = response?.data || null;

  return (
    <SelectTicketPage
      showingId={showingId}
      serverEvent={event}
      seatMapId={seatMapId}
    />
  );
}