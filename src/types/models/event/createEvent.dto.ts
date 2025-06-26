export interface CreateEventDto {
  title: string;
  description?: string;
  isOnline: boolean;
  districtId?: number;
  wardString?: string;
  streetString?: string;
  venue: string;
  orgName: string;
  orgDescription: string;
  categoryIds: number[];
  imgLogoUrl: string;
  imgPosterUrl: string;
}