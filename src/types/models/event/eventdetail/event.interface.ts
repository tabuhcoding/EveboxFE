
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
  startTime: string; // ISO string
  endTime: string;   // ISO string
  position: number;
  status: string;
  imageUrl: string;
  isHidden: boolean;
}

// Showing with list of ticket types
export interface Showing {
  id: string;
  eventId: number;
  status: string;
  isFree: boolean;
  isSalable: boolean;
  isPresale: boolean;
  seatMapId: number;
  startTime: string; // ISO string
  endTime: string;   // ISO string
  isEnabledQueueWaiting: boolean;
  showAllSeats: boolean;
  TicketType: TicketType[];
}

// Category
export interface Category {
  id: number;
  name: string;
}

// Main Event Detail object
export interface EventDetailResponseDto {
  id: number;
  title: string;
  description: string;
  startDate: string;
  organizerId: string | null;
  status: string;
  venue: string;
  imgPosterUrl: string;
  imgLogoUrl: string;
  isOnline: boolean;
  locationsString: string;
  lastScore: number;
  totalClicks: number;
  weekClicks: number;
  isSpecial: boolean;
  isOnlyOnEve: boolean;
  orgName: string;
  orgDescription: string;
  categories: Category[];
  showing: Showing[];
  minPrice: number;
  isUserFavorite?: boolean;
  isUserNotice?: boolean;
  isUserFavoriteOrganizer?: boolean;
  isUserNoticeOrganizer?: boolean;
}

// Full API Response
export interface EventDetailResponse {
  statusCode: number;
  message: string;
  data: EventDetailResponseDto;
}

export interface DescriptionProps {
    description: string;
}

export interface MoreInformationProps {
    title: string;
    location: string;
    locationsString: string;
}

export interface EventDetail {
  id: number;
  title: string;
  description: string;
  startDate: string;
  venue: string;
  showing: Showing[];
  minPrice: number;
  imgLogoUrl: string ;
  imgPosterUrl: string ;
  orgName: string;
  locationsString: string;
  orgDescription: string;
  status:string;
  totalClicks?: number;
  lastScore?: number;
  organizerId: string;
}