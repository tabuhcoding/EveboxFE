/* Package Application */
import ShowingDetailPage from "./_components/showingDetailPage";

interface Props {
  params: Promise<{
    id: string;
  }>
}

export default async function Page({ params }: Props) {
  const { id } = await params;

  return (
    <ShowingDetailPage showingId={id} />
  )
}