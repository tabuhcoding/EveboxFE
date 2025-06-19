import { Category } from "@/services/interface/eventSpecialTable";
import { BaseApiResponse } from "@/types/baseApiResponse";

export interface Event {
  id: number;
  title: string;
  lastScore: string;
  status: string;
  startDate: string;
  categories: Category[];
  imgPosterUrl: string;
  imgLogoUrl: string;
  totalClicks: number;
  minTicketPrice: number;
}

export interface SearchEvent {
  events: SearchEventsResponse;
  pages: number;
  limit: number;
  totalPages: number;
  totalItems: number;
  isLoading?: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export type SearchEventsResponse = BaseApiResponse<Event[]>;