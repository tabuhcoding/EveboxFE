import { BaseApiResponse } from "types/baseApiResponse";

export interface Event {
  id: number;
  title: string;
  // startDate: string;
  startTime: string;
  status: string;
  Images_Events_imgPosterIdToImages?: { imageUrl: string };
  minTicketPrice: number;
}

export interface Category {
  id: number;
  name: string;
  createAt: string;
}

export interface CategorySpecial {
  category: Category;
  events: Event[];
}

export interface EventResponse {
  specialEvents: Event[];
  trendingEvents: Event[];
  onlyOnEve: Event[];
  categorySpecial: CategorySpecial[];
}

export type FrontDisplayResponse = BaseApiResponse<EventResponse>;