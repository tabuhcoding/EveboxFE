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

export interface Showing {
  id: string;
  eventId: number;
  status: string;
  isFree: boolean;
  isSalable: boolean;
  isPresale: boolean;
  seatMapId: number;
  startTime: string;
  endTime: string;
  isEnabledQueueWaiting: boolean;
  showAllSeats: boolean;
  TicketType: TicketType[];
}

export interface EventDetail {
  id: number;
  title: string;
  description: string;
  startDate: string;
  venue: string;
  Showing: Showing[];
  minPrice: number;
  imgLogoUrl: string ;
  imgPosterUrl: string ;
  orgName: string;
  locationsString: string;
  orgDescription: string;
}

export interface DescriptionProps {
    description: string;
}