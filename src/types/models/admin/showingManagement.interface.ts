import { PaginationData } from "@/types/baseApiResponse";

export interface Event {
  id: number;
  title: string;
}

export interface TicketType {
  id: string;
  name: string;
  description: string;
  color: string;
  isFree: boolean;
  originalPrice: number;
  startTime: string;
  endTime: string;
  position: number;
  quantity: number;
  maxQtyPerOrder: number;
  minQtyPerOrder: number;
  imageUrl: string;
  isHidden: boolean;
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

export interface TicketTypeShowingDetail {
  id: string;
  name: string;
  description: string;
  isFree: boolean;
  price: number;
  originalPrice: number;
  maxQtyPerOrder: number;
  minQtyPerOrder: number;
  startTime: string;
  endTime: string;
  status: string;
  quantity: number;
  sold: number;
}

export interface ShowingDetail {
  id: string;
  eventId: number;
  status: string;
  isFree: boolean;
  isSalable: boolean;
  seatMapId: number;
  startTime: string;
  endTime: string;
  event: Event;
  ticketTypes: TicketTypeShowingDetail[];
}

export interface ShowingDetailApiResponse {
  data: ShowingDetail;
}

export interface TicketTableProps {
  showingID: string;
  ticketTypes: TicketTypeShowingDetail[];
}

export interface TicketTypeDetailProps {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  description: string;
  price: number;
  maxQtyPerOrder: number;
  minQtyPerOrder: number;
  quantity: number;
  sold: number;
  status: string;
  imageUrl: string;
}

export interface ShowingInTicketTypeDetail {
  id: string;
  event: Event;
  startTime: string;
  endTime: string;
  ticketType: TicketTypeDetailProps;
}

export interface TicketTypeDetailApiReponse {
  data: ShowingInTicketTypeDetail;
}