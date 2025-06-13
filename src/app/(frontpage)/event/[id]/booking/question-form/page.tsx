/* Package Application */
import QuestionFormPage from "./_components/questionFormPage";

interface PageProps {
  searchParams: Promise<{
    showingId?: string;
    seatMapId?: string;
  }>;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const showingId = params.showingId || "";
  const seatMapId = Number(params.seatMapId || 0);

  return (
    <QuestionFormPage showingId={showingId} seatMapId={seatMapId} />
  );
}