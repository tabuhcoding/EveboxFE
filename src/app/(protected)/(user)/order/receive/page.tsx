/* Package System */

/* Package Application */
import ReceiveTicket from "./_components/receiveTicketSuccessPage";

interface PageProps {
  searchParams: Promise<{
    sendKey: string;
  }>;
}

export default async function Page({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;

  const key = resolvedSearchParams.sendKey;
  return <ReceiveTicket sendKey={key ?? ''} />
}