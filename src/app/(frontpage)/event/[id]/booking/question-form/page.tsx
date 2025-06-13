/* Package Application */
import QuestionFormPage from "./_components/questionFormPage";

interface PageProps {
  searchParams: {
    showingId?: string;
    seatMapId?: number
  }
}

export default async function Page({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  
  const showingId = resolvedSearchParams.showingId || "";
  const seatMapId = resolvedSearchParams.seatMapId || 0;

  return (
    <QuestionFormPage showingId={showingId} seatMapId={seatMapId} />
  );
}