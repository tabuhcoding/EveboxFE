import { PaginationData } from "@/types/baseApiResponse";

export interface Event {
  id: number;
  title: string;
}

export interface TicketType {
  id: string;
}

export interface Showing {
  id: string;
  startTime: string;
  endTime: string;
  seatmapId: number;
  eventId: number;
  eventTitle: string;
  event: Event;
  ticketTypes: TicketType[];
}

export interface ShowingTableProps {
  searchKeyword: string;
  dateFrom: string;
  dateTo: string;
}

export interface SearchBarProps {
  onSearch: (keyword: string) => void;
}

export interface SortConfig<T> {
  key: keyof T;
  direction: 'asc' | 'desc';
}

export interface ShowingAdminParams {
  page: number;
  limit: number;
  startTime?: string;
  endTime?: string;
  search?: string;
}

export interface ShowingApiResponse {
  data: Showing[];
  pagination: PaginationData;
}

//Filter
export interface FilterProps {
  dateFrom: string;
  dateTo: string;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onReset: () => void;
}
