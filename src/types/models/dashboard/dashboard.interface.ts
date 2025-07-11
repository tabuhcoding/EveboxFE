/* Package System */
import { CalendarDate } from "@internationalized/date";
import { RangeValue } from "@react-types/shared";

export interface Slide {
  image: string;
  title: string;
  subtitle: string;
}

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface Event {
  id: number;
  title: string;
  startDate: string;
  // startTime: string;
  status: string;
  totalClicks: number;
  imgPosterUrl: string;
  minTicketPrice: number;
  isUserFavorite?: boolean;
  isUserNotice?: boolean;
}

export interface EventSliderProps {
  title: string;
  subtitle?: string;
  showViewMore?: boolean;
  events: Event[];
}

export interface ImageSliderProps {
  events: Event[];
}

export interface DatePickerProps {
  value: RangeValue<CalendarDate> | null;
  onDateRangeChange: (value: RangeValue<CalendarDate> | null) => void;
}

export interface TabSwitcherProps {
  sliderEvents: Event[];
  dataMonthlyRecommendedEvent: Event[];
}