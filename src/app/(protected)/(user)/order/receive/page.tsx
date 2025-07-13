/* Package System */

/* Package Application */
import ReceiveTicket from "./_components/receiveTicketSuccessPage";

interface PageProps {
  searchParams: {
    sendKey?: string;
  };
}

export default function Page({ searchParams }: PageProps) {
  return <ReceiveTicket sendKey={searchParams.sendKey ?? ''} />
}