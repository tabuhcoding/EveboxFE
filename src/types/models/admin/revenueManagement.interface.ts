/* Package System */
import { Dispatch, SetStateAction } from "react";

export interface RevenueTabsProps {
  activeTab: "app" | "organization" | "event";
  onTabChange: (tab: "app" | "organization" | "event") => void;
  loading: boolean;
}

export interface RevenueFilterProps {
  onConfirm: (fromDate?: string, toDate?: string, type?: "month" | "year") => void;
  onReset: () => void;
  isLoading: boolean;
}

export interface FilterProps {
  onFilterChange: (filter: { fromDate?: string; toDate?: string; search?: string }) => void;
  isLoading?: boolean
}

export type SubTabType = "day" | "location" | "price"

export interface RevenueSubTabsProps {
  activeSubTab: SubTabType
  onSubTabChange: (tab: SubTabType) => void
}

// Organizer Revenue
export interface TicketTypeRevenueData {
  ticketTypeId: string;
  name: string;
  price: number;
  sold: number;
  revenue: number;
}

export interface ShowingRevenueData {
  showingId: string;
  startDate: string; // Or Date if you're parsing it
  endDate: string;   // Or Date if you're parsing it
  revenue: number;
  ticketTypes: TicketTypeRevenueData[];
}

export interface EventRevenueData {
  eventId: number;
  eventName: string;
  totalRevenue: number;
  platformFeePercent: number;
  actualRevenue: number;
  showings: ShowingRevenueData[];
}

export interface OrganizerRevenueData {
  orgId: string;
  organizerName: string;
  totalRevenue: number;
  platformFeePercent: number;
  actualRevenue: number;
  events: EventRevenueData[];
}

export interface AppRevenueData {
  totalRevenue: number;
  actualRevenue: number;
  platformFeePercent: number;
  organizers: OrganizerRevenueData[];
}

export interface ShowingRevenueInEventTable {
  showingId: string;
  startDate: string;
  endDate: string;
  revenue: number;
  ticketTypes: TicketTypeRevenueData[];
  isExpanded?: boolean;
}

export interface EventRevenueInEventTable {
  id: number;
  name: string;
  totalRevenue: number;
  platformFee: number;
  actualRevenue: number;
  showings: ShowingRevenueInEventTable[];
  isExpanded?: boolean;
  selectedDetailId?: string;
  orgId?: string;
  orgName?: string;
}

export interface EventRevenueTableProps {
  loading: boolean;
  events: EventRevenueInEventTable[];
  orgId: string;
  toggleEvent: (orgId: string, eventId: number) => void;
  toggleEventDetail: (orgId: string, eventId: number, showingId: string) => void;
  formatCurrency: (amount: number) => string;
  className?: string;
}

export type Organization = {
  id: string;
  name: string;
  actualRevenue: number;
  events: EventRevenueInEventTable[];
  isExpanded?: boolean;
  selectedEventId?: number;
  orgId?: string;
  orgName?: string;
};

export interface RevenueOrgTableProps {
  loading: boolean;
  orgLoadingId?: string;
  organizations?: Organization[];
  appId?: number;
  toggleOrganization?: (appId: number, orgId: string) => void;
  toggleEvent?: (appId: number, orgId: string, eventId: number) => void;
  toggleEventDetail?: (appId: number, orgId: string, eventId: number, showingId: string) => void;
  formatCurrency: (amount: number) => string;
  className?: string;
}

// App Revenue
export type AppRevenue = {
  id: number
  totalRevenue: number
  systemDiscount: number
  actualRevenue: number
  organizations: Organization[]
  isExpanded?: boolean
  selectedOrgId?: string
}

export interface RevenueAppTableProps {
  fromDate?: string
  toDate?: string
  orgLoadingId?: string;
  setOrgLoadingId?: (id: string | undefined) => void;
  appRevenues: AppRevenue[]
  setAppRevenues: Dispatch<SetStateAction<AppRevenue[]>>
  loading: boolean
  setLoading: Dispatch<SetStateAction<boolean>>
  toggleOrganization?: (appId: number, orgId: string) => void;
}

export interface RawRevenueChartData {
  period: string;
  actualRevenue: number;
  totalRevenue: number;
}

export interface RevenueSummaryResponse {
  labels: string[];
  values: number[];
}

export interface RevenueChartProps {
  type: "month" | "year"
  from: string
  to: string
}

export interface ProvinceRevenueData {
  area_code: string;
  provinceName: string;
  provinceEnName: string;
  eventCount: number;
  showingCount: number;
  totalRevenue: number;
}

export interface RevenueByTicketPriceData {
  maxPrice: number;
  minPrice: number;
  total: number;
  sold: number;
  conversionRate: number;
  revenue: number;
}

// Revenue [orgId, eventId]
export interface ShowingInOrgEvent {
  showingId: string;
  startDate: string;
  endDate: string;
  revenue: number;
  ticketTypes: TicketTypeRevenueData[]
}
export interface EventRevenueV2Data {
  title: string;
  venue: string;
  locationsString: string;
  showings: ShowingInOrgEvent[];
}

export interface ByTicketTypeData {
  typeName: string;
  price: number;
  sold: number;
  ratio: number;
}

export interface ShowingDetailRevenueData {
  eventId: number;
  eventTitle: string;
  showingId: string;
  startTime: string;
  endTime: string;
  totalRevenue: number;
  ticketsSold: number;
  totalTickets: number;
  percentageSold: number;
  byTicketType: ByTicketTypeData[];
}