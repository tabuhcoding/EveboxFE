/* Package System */
import { Dispatch, SetStateAction } from "react";

/* Package Application */
import { EventDetail } from "../eventdetail/event.interface";

// Multi-ticket state (áp dụng cho cả case có seat và không seat)
export type SelectedTicketsState = {
  [ticketTypeId: string]: {
    quantity: number; // tổng số vé loại này
    sectionId?: number; // sectionId nếu event có seatmap
    seatIds?: number[]; // nếu chọn ghế
  }
};

export interface Ticket {
  id: string;
  name: string;
  price: number;
  available: boolean;
  description: string;
}

export interface SelectTicketProps {
  tickets: Ticket[];
  selectedTickets: SelectedTicketsState;
  setSelectedTickets: Dispatch<SetStateAction<SelectedTicketsState>>;
  selectedTicket: string | null;
  setSelectedTicket: Dispatch<SetStateAction<string | null>>;
}

export interface SelectTicketPageProps {
  showingId: string;
  serverEvent: EventDetail | null;
  seatMapId?: number;
}