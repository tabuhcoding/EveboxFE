
export interface Slide {
  image: string;
  title: string;
  subtitle: string;
}

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface MenuItem {
  icon: React.ReactNode;
  text: string;
  href?: string;
  onClick?: () => Promise<void> | void;
}

export interface Event {
  id: number;
  title: string;
  // startDate: string;
  startTime: string;
  status: string;
  Images_Events_imgPosterIdToImages?: { imageUrl: string };
  minTicketPrice: number;
}
