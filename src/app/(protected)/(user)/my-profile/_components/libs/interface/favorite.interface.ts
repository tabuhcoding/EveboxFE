import { UserFavEvent } from "@/types/models/dashboard/user.interface";

export interface OrganizerDetail {
  id: number;
  Images_Events_imgLogoIdToImages?: { imageUrl: string };
  orgName: string;
  orgDescription: string;
}

//My favorite page
export interface FavoriteProps {
    events: UserFavEvent[];
    currentPage: number;
    itemsPerPage: number;
    totalPages: number;
    totalItems: number;
    isLoading?: boolean;
    onPrevious: () => void;
    onNext: () => void;
  }