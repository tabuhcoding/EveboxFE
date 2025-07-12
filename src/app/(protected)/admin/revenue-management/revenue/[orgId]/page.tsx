import OrganizerRevenuePage from "./_components/organizerRevenue";

interface Props {
  params: Promise<{
    orgId: string;
  }>
}

export default async function Page({ params }: Props) {
  const { orgId } = await params;
  
  return (
    <OrganizerRevenuePage orgId={orgId} />
  )
}