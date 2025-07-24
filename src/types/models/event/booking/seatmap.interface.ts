import { TicketTypeSectionsProps } from "@/app/(protected)/organizer/events/[id]/seatmap/_components/editSeatmapPage";
import { JsonValue } from "type-fest";

import { BaseApiResponse } from "types/baseApiResponse";

export enum SeatmapType {
  NOT_A_SEATMAP = 'NOT_A_SEATMAP',
  SELECT_SECTION = 'SELECT_SECTION',
  SELECT_SEAT = 'SELECT_SEAT',
}

export type SelectedSeatsMap = {
  [ticketTypeId: string]: {
    seatIds: number[];
    sectionId: number;
    quantity: number;
    labels: string[];
  }
};

export interface Seat {
  id: number;
  name: string;
  rowId: number;
  position: number;
  positionX: Record<string, number>;
  positionY: Record<string, number>;
  createdAt: Date;
  status: string;
}

export interface SeatMapProps {
  seatMap: SeatMap;
  ticketType: TicketType[];
  onSeatSelectionChange?: (
    seat: {
      id: number;
      ticketTypeId: string
      label: string[];
    },
    isSelected: boolean,
    quantity?: number,
    sectionId?: number
  ) => void;
  seatStatusRecord?: Record<number, string>; // Trạng thái ghế, key là seatId
  onSetSeatStatus?: (seatId: number[]) => void
  selectedSeatIds?: number[];
  selectedTickets?: SelectedTicketsState;
  selectedSectionId?: number;
  ticketTypeSections?: TicketTypeSectionsProps[]; // Thông tin về các section của loại vé
}

export interface SeatMapElement {
  type: string;
  data: string;
  fill: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Row {
  id: number;
  name: string;
  sectionId: number;
  createdAt: Date;
  Seat: Seat[];
}

export interface Section {
  id: number;
  name: string;
  status: string;
  seatmapId: number;
  createdAt: Date;
  isStage: boolean;
  element?: SeatMapElement[];
  attribute: JsonValue;
  ticketTypeId?: string;
  ticketTypeName?: string; // Tên loại vé nếu có
  quantity?: number;
  sold?: number;
  color?: string;
  Row?: Row[];
}

export interface SeatMap {
  id: string | number;
  name: string;
  createdAt: Date;
  viewBox: string;
  status: number;
  Section?: Section[];
  seatMapType: SeatmapType;
}

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
  effectiveFrom: Date;
  effectiveTo: Date;
  position: number;
  status: string;
  imageUrl: string;
  isHidden: boolean;
}

export interface ShowingData {
  id: string | number;
  eventId: number;
  status: string;
  isFree: boolean;
  isSalable: boolean;
  isPresale: boolean;
  seatMapId: number;
  startTime: Date;
  endTime: Date;
  isEnabledQueueWaiting: boolean;
  showAllSeats: boolean;
  Events?: {
    id: number;
    title: string;
    startDate: Date;
    status: string;
    lastScore: string;
    minTicketPrice: number;
    imgLogoUrl: string;
    imgPosterUrl: string;
    totalClicks: number;
    weekClicks: number;
  };
  TicketType?: TicketType[];
  SeatMap?: SeatMap;
  Form?: {
    id: number;
    name: string;
    inputs?: {
      id: number;
      formId: number;
      fieldName: string;
      type: string;
      required: boolean;
      regex: string;
    }
  }
}

export type SeatMapResponse = BaseApiResponse<SeatMap>;

export interface EventProps {
  id: number;
  title: string;
  description: string;
  startDate: string;
  venue: string;
  imgPosterUrl: string;
  locationsString: string;
}

// Một loại vé đã chọn (áp dụng cho cả ticket thường & seatmap)
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
  showingStartTime: Date | string | null;
  totalTickets: number;
  totalAmount: number;
  hasSelectedTickets: boolean;
  selectedTickets: SelectedTicketsState;      // <-- mới
  ticketType: TicketType[];                   // <-- để tra info loại vé (name, price...)
  selectedSeatIds?: number[];                 // tổng hợp seat đã chọn (cho tiện)
  showingId?: string;
  seatMapId?: number;
  onClearSelection?: () => void;
}

export interface SeatInfoPayLoad {
  seatId: number;
}

export interface TicketTypeSelectionPayload {
  tickettypeId: string;
  sectionId?: number;
  quantity?: number;
  seatInfo: SeatInfoPayLoad[];
}

export interface SelectSeatPayload {
  showingId: string;
  ticketTypeSelection: TicketTypeSelectionPayload[];
}