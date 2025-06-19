export interface CreateShowingDto {
  startTime: string; // ISO format
  endTime: string;
}

export interface CreateShowingResponseDto {
  showingId: string;
}

export interface DeleteShowingResponseDto {
  showingId: string;
}

export interface UpdateShowingDto {
  startTime?: string;
  endTime?: string;
}

export interface UpdateShowingResponseDto {
  showingId: string;
}

export interface TicketTypeDto {
  id: string;
  name: string;
  description: string;
  color: string;
  isFree: boolean;
  originalPrice: number;
  startTime: Date;
  endTime: Date;
  position: number;
  quantity: number;
  maxQtyPerOrder: number;
  minQtyPerOrder: number;
  imageUrl: string;
  isHidden: boolean;
}

export interface ShowingDetailDto {
  id: string;
  startTime: Date;
  endTime: Date;
  eventId: number;
  seatMapId: number;
  TicketType: TicketTypeDto[];
}

export interface GetAllShowingDetailOfEventResponseDto {
  statusCode: number;
  message: string;
  data: ShowingDetailDto[];
}