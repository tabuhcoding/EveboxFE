import { OrdersPage } from "./components/orders-page"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
  const { id: eventIdStr } = await params
  const eventId = Number(eventIdStr)

  return <OrdersPage eventId={eventId} />
}
