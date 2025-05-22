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
  imgLogoUrl: string;
  minTicketPrice: number;
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
  onDateRangeChange: (range: RangeValue<CalendarDate> | null) => void;
}

export interface TabSwitcherProps {
  sliderEvents: Event[];
  dataMonthlyRecommendedEvent: Event[];
}