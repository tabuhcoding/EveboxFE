import TicketDetailClient from './_components/ticketDetail';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <TicketDetailClient ticketId={id} />
  );
}
