import { BaseApiResponse } from "types/baseApiResponse";

export interface TicketType {
    id: string;
    name: string;
    description: string;
    color: string;
    isFree: boolean;
    price: number;
    originalPrice: number;
    maxQtyPerOrder: number;
    minQtyPerOrder: number;
    effectiveFrom: string;
    effectiveTo: string;
    status: string;
    imageUrl?: string;
  }
  
export interface Showing {
    id: string;
    eventId: number;
    status: string;
    startTime: string;
    endTime: string;
    TicketType: TicketType[];
  }
  
export interface Event {
    id: number;
    title: string;
    description: string;
    startDate: string;
    venue: string;
    showing: Showing[];
    Images_Events_imgPosterIdToImages?: { imageUrl: string };
  }

// Response cho API /user/me
export type EventResponse = BaseApiResponse<Event>;