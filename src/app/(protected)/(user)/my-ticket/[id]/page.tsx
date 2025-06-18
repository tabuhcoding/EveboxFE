import TicketDetailClient from './_components/ticketDetail';

export default function Page({ params }: { params: { id: string } }) {
  return (
    <TicketDetailClient ticketId={params.id} />
  );
}
