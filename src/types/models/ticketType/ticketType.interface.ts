export interface CreateTicketTypeDto {
  status: string;
  name: string;
  description: string;
  color: string;
  isFree: boolean;
  originalPrice: number;
  startTime: string;
  endTime: string;
  position: number;
  quantity?: number;
  maxQtyPerOrder: number;
  minQtyPerOrder: number;
  imageUrl: string;
  isHidden?: boolean;
}

export interface CreateTicketTypeResponseDto {
  ticketTypeId: string;
}

export interface UpdateTicketTypeDto {
  status?: string;
  name?: string;
  description?: string;
  color?: string;
  isFree?: boolean;
  originalPrice?: number;
  startTime?: string;
  endTime?: string;
  position?: number;
  quantity?: number;
  maxQtyPerOrder?: number;
  minQtyPerOrder?: number;
  imageUrl?: string;
  isHidden?: boolean;
}

export interface UpdateTicketTypeResponseDto {
  ticketTypeId: string;
}

export interface DeleteTicketTypeResponseDto {
  ticketTypeId: string;
}