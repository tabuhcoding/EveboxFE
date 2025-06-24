// import { getSearchEvents } from "@/services/event.service";

// import SearchClient from "./_components/searchClient";
// import { SearchEventsParams } from "@/types/models/dashboard/searchEventParams.interface";

// // export default async function Search({ searchParams }: { searchParams: Promise<{ title?: string, type?: string;startDate?: string; endDate?: string; }> }) {
// //   const searchTitle = (await searchParams).title || "";
// //   const type = (await searchParams).type || "";
// //   const startDate = (await searchParams).startDate;
// //   const endDate = (await searchParams).endDate;

// //   const events = await getSearchEvents({
// //         title: searchTitle,
// //         type,
// //         startDate,
// //         endDate,
// //       })
// //   console.log("Event-------",events);
  
// //   return <SearchClient events={events} />;
// // }

// export default async function Search({
//   searchParams,
// }: {
//   searchParams: Promise<SearchEventsParams>;
// }) {
//   const resolvedParams = await searchParams;

//   const title = resolvedParams.title || '';
//   const type = resolvedParams.type || '';
//   const startDate = resolvedParams.startDate;
//   const endDate = resolvedParams.endDate;
//   const page = Number(resolvedParams.pages) || 1;
//   const limit = Number(resolvedParams.limit) || 10;

//   const eventsResponse = await getSearchEvents({
//     title,
//     type,
//     startDate,
//     endDate,
//     pages: page,
//     limit,
//   });

//   console.log('Event Response:', eventsResponse);

//   return (
//     <SearchClient
//       initialEvents={eventsResponse?.events.data || []}
//       initialPagination={{
//         totalItems: eventsResponse?.totalItems || 0,
//         totalPages: eventsResponse?.totalPages || 1,
//         page: eventsResponse?.pages || 1,
//         limit: eventsResponse?.limit || 10,
//       }}
//     />
//   );
// }

import SearchClient from "./_components/searchClient";

export default function SearchPage() {
  return <SearchClient />;
}