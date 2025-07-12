import { TicketType } from "../admin/showingManagement.interface";

export interface EventOrgFrontDisplayDto {
  id: number;
  title: string;
  startDate: Date;
  deleteAt: Date;
  imgLogoUrl: string;
  imgPosterUrl: string;
  locationString: string;
  venue: string;
  isApproved: boolean;
  role: number;
}

// Define interfaces to match the DTO structures

export interface ITicketTypeSummary {
  typeName: string
  price: number
  sold: number
  ratio: number
}

export interface IShowTime {
  id: string
  startTime: string | Date
  endTime: string | Date
  eventId?: number
  seatMapId?: number
  TicketType?: TicketType[]
  isSelected?: boolean
}

export interface IEventSummaryData {
  eventId: number
  eventTitle: string
  showingId: string
  startTime: string | Date
  endTime: string | Date
  totalRevenue: number
  ticketsSold: number
  totalTickets: number
  percentageSold: number
  byTicketType: ITicketTypeSummary[]
  revenueChart: IRevenueChartData[]
}

export interface IRevenueChartData {
  date: string | Date,
  revenue: number,
  ticketsSold: number
}

export interface IFormattedShowingData {
  id: string,
  startTime: string | Date,
  endTime: string | Date,
  formattedLabel: string
}