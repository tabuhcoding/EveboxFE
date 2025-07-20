import { TicketType } from "../event/booking/seatmap.interface";

export interface Showing {
  id: string;
  startTime: string;
  endTime: string;
  eventId: number;
  seatMapId: number;
  TicketType: TicketType[];
}

export interface ConnectShowingToSeatMapPayload {
  showingId: string;
  seatmapId: number;
  ticketTypeSectionMap: Record<string, number[]>;
}

export interface SeatmapResponse {
  id: number;
  name: string;
  createdAt: Date;
  viewBox: string;
  status: number;
}