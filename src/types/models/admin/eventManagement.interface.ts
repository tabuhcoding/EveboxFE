export interface ConfirmApprovalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export interface EventTableProps {
  activeTab: string;
  searchKeyword: string;
  categoryFilter: string
  dateFrom: string;
  dateTo: string;
  adminFilter: string;
  onLoadFinish?: () => void;
  onTotalChange?: (total: number) => void;
}

//Pagination
export interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPrevious: () => void;
  onNext: () => void;
}

export interface SortConfig<T> {
  key: keyof T;
  direction: 'asc' | 'desc';
}

export interface Category {
  id: number;
  name: string;
}

export interface EventAdminTable {
  id: number;
  title: string;
  createdAt: string;
  deleteAt: string | null; 
  imgLogoUrl: string; 
  imgPosterUrl: string; 
  locationString: string; 
  venue: string; 
  isApproved: boolean; 
  isSpecial: boolean; 
  isOnlyOnEve: boolean;
  isOnline: boolean; 
  categories: Category[]; 
  meta: {
    totalItems: number;
    totalPages: number;
    page: number;
    limit: number;
  };
}

export interface EventTableProps {
  activeTab: string;
  searchKeyword: string;
  categoryFilter: string
  dateFrom: string;
  dateTo: string;
}

export interface EventAdminDataDto {
  id: number;
  title: string;
  createdAt: string;
  deleteAt: string | null;
  organizerId: string;
  imgLogoUrl: string;
  imgPosterUrl: string;
  locationString: string;
  venue: string;
  isApproved: boolean;
  isSpecial: boolean;
  isOnlyOnEve: boolean;
  isOnline: boolean;
  categories: Category[];
  canManage: boolean;
  manageBy: string;
}

export interface EventManagementApiResponse {
  data: EventAdminDataDto[];
  pagination: {
    totalItems: number;
    totalPages: number;
    page: number;
    limit: number;
  };
}

export interface EventAdminParams {
  page: number;
  limit: number;
  isApproved?: boolean;
  isDeleted?: boolean;
  createdFrom?: string;
  createdTo?: string;
  categoryId?: number;
  title?: string;
  admin?: string;
}

export interface EventPaginationProps {
  currentPage: number;
  totalItems: number;
  eventsPerPage: number;
  onPageChange: (page: number) => void;
  setEventsPerPage: (num: number) => void;
}

//Tabs
export interface TabsProps {
  activeTab: string;
  setActiveTab: (tabId: string) => void;
  loading?: boolean;
}

//Search
export interface SearchBarProps {
  onSearch: (keyword: string) => void;
}

//Filter
export interface FilterProps {
  categoryFilter: string;
  onCategoryChange: (value: string) => void;
  dateFrom: string;
  dateTo: string;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onReset: () => void;
  adminFilter: string;
  onAdminChange: (value: string) => void;
}

export interface UpdateEventAdminPayload {
  isSpecial?: boolean | null;
  isOnlyOnEve?: boolean | null;
  isSpecialForCategory?: boolean | null;
  isApproved?: boolean | null;
  categoryIds?: number[];
}

export interface TicketTypeOfShowing {
  id: string;
}

export interface ShowingOfEvent {
  id: string;
  startTime: string;
  endTime: string;
  seatMapId: number;
  TicketType: TicketTypeOfShowing[];
}

export interface EventDetailAdmin {
  id: number;
  title: string;
  description: string;
  startDate: string;
  organizerId?: string;
  venue: string;
  imgLogoUrl: string;
  imgPosterUrl: string;
  isOnline: boolean;
  lastScore: string;
  totalClicks: number;
  createdAt: string;
  deleteAt: string | null;
  isApproved: boolean;
  locationsString: string;
  weekClicks: number;
  isSpecial: boolean;
  isOnlyOnEve: boolean;
  orgName: string;
  orgDescription: string;
  categories: Category[];
  status: string;
  showing: ShowingOfEvent[];
}

export interface ShowingTableProps {
  showings: ShowingOfEvent[];
}