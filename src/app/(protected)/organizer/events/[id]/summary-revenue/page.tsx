// "use server"

import { SummaryRevenuePage } from "./components/summary-revenue"

interface PageProps {
  params: Promise<{ id: string }>
}

const SummaryRevenuePageWrapper = async ({ params }: PageProps) => {
  const { id } = await params

  return <SummaryRevenuePage params={{ id }} />
}

export default SummaryRevenuePageWrapper
