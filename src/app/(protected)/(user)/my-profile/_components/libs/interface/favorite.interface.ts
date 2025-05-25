export interface OrganizerDetail {
  id: number;
  Images_Events_imgLogoIdToImages?: { imageUrl: string };
  orgName: string;
  orgDescription: string;
}

//My favorite page
export interface FavoriteProps {
    events: { favoriteEvents: any[] };
    favoriteOrganizers: OrganizerDetail[];
    paginatedData: OrganizerDetail[];
    currentPage: number;
    itemsPerPage: number;
    onPrevious: () => void;
    onNext: () => void;
  }