/* Package Application */
import PaymentPage from "./_components/paymentPage";

interface PageProps {
  searchParams: Promise<{
    showingId?: string;
    seatMapId?: string;
  }>;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const showingId = params.showingId || "";
  const seatMapId = params.seatMapId ? parseInt(params.seatMapId) : 0;
  
  return (
    seatMapId !== 0 ? (
      <PaymentPage showingId={showingId} seatMapId={seatMapId} />
    ) : (
      <PaymentPage showingId={showingId} />
    )
  );
}