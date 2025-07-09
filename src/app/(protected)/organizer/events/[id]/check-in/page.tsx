import CheckinPage from "./components/checkinPage";

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps){
     const { id: eventIdStr } = await params
    const eventId = Number(eventIdStr)

    return(
        <CheckinPage  eventId={eventId} />
    )
}
