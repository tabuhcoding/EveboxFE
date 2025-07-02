import AccountDetailPage from "./_components/accountDetailPage";

interface PageProps {
  params: Promise<{
    id: string;
  }>
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  return (
    <AccountDetailPage id={id} />
  )
}