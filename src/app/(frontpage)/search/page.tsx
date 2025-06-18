import { getSearchEvents } from "@/services/event.service";

import SearchClient from "./_components/searchClient";



export default async function Search({ searchParams }: { searchParams: Promise<{ title?: string, type?: string;startDate?: string; endDate?: string; }> }) {
  const searchTitle = (await searchParams).title || "";
  const type = (await searchParams).type || "";
  const startDate = (await searchParams).startDate;
  const endDate = (await searchParams).endDate;

  const events = await getSearchEvents({
        title: searchTitle,
        type,
        startDate,
        endDate,
      })
  console.log("Event-------",events);
  
  return <SearchClient events={events} />;
}