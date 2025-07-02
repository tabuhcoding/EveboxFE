export interface DisplayEvent {
  id: number;
  title: string;
  startTime: string;
  location: string;
  address: string;
  Images_Events_imgPosterIdToImages?: { imageUrl: string };
  image: string;
  isApproved: boolean;
  locationsString: string;
  venue: string;
}