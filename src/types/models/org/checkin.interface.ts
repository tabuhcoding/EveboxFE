// types/models/booking/checkin.interface.ts

export interface CheckedInTicketDto {
  order_id: string;
  ticket_id: string;
  startTime: string | Date;
  endTime: string | Date;
  venue: string;
  deliveryType: 'PHYSICAL_TICKET' | 'E_TICKET';
}
