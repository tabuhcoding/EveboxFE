// types/user.ts
import { TicketTypeSelectionPayload } from "./booking/seatmap.interface";

export interface TicketTypeSelectionCache extends TicketTypeSelectionPayload {
  ticketTypeName: string;
  ticketTypePrice?: number;
}

export interface RedisInfo {
  showingId: string;
  expiredTime?: number;
  totalAmount?: number;
  ticketTypeSelection?: TicketTypeSelectionCache[];
}