import { OrdersPage } from "./components/orders-page"

interface PageProps {
  params: { id: string }
}

export default async function Page({ params }: PageProps) {
  const { id: eventIdStr } = await params
  const eventId = Number(eventIdStr)

  return <OrdersPage eventId={eventId} />
}
