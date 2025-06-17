import { RedisInfo } from "../redisSeat";

import { EventProps, TicketType } from "./seatmap.interface";

export interface PaymentMethod {
  paymentMethod: string;
  status: string;
}

export interface PaymentMethodProps {
  onMethodSelected: (method: string) => void;
}

export interface SelectedTicketInfo {
  quantity: number;          // Tổng số vé đã chọn (hoặc số ghế nếu là seatmap)
  seatIds?: number[];        // Chỉ có ở seatmap: ID các ghế đã chọn cho loại vé này
  sectionId?: number;        // Nếu cần, lưu ID section của ghế
  name: string[];
}

// selectedTickets: key là ticketTypeId (string), value là SelectedTicketInfo
export type SelectedTicketsState = {
  [tickettypeId: string]: SelectedTicketInfo;
};

export interface TicketInforProps {
  event: EventProps;
  totalTickets: number;
  totalAmount: number;
  selectedTickets: SelectedTicketsState;      // <-- mới
  ticketType: TicketType[];                   // <-- để tra info loại vé (name, price...)
  selectedSeatIds?: number[];                 // tổng hợp seat đã chọn (cho tiện)
  showingId?: string;
  seatMapId?: number;
  redisInfo: RedisInfo | null;
  paymentMethod?: string;
}

export type OrderStatus = "PENDING" | "SUCCESS" | "CANCELLED"

export interface OrderTicketResponse {
  id: string;
  seatname?: string;
  sectionname?: string;
  description?: string;
}

export interface OrderTicketTypeResponse {
  id: string;
  name: string;
  description: string;
  price: number;
  tickets: OrderTicketResponse[];
}

export interface OrderShowingResponse {
  title: string;
  venue: string;
  locationsString: string;
  startTime: string;
  endTime: string;
  imageUrl?: string;
};

export interface OrderPaymentInfoResponse {
  method: string;
  paidAt: string;
}

export interface OrderResponse {
  id: string;
  status: OrderStatus;
  createdAt: string;
  PaymentInfo?: OrderPaymentInfoResponse;
  Ticket: OrderTicketTypeResponse[];
  Showing: OrderShowingResponse;
}

export interface PaymentCheckoutPayload {
  showingID: string;
  paymentMethod: string;
  paymentSuccessUrl: string;
  paymentCancelUrl: string;
}

export interface PaymentCheckoutResponse {
  paymentLink: string;
}

