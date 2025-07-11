export interface UpdateEventResponseData {
  id: number;
  isApproved: boolean;
  signMessage?: string;
  checkMessage?: string;
}

export interface UpdateEventResponseDto {
  statusCode: number;
  message: string;
  data: UpdateEventResponseData;
}

export interface UpdateEventDto {
  title?: string;
  isOnline?: string | boolean | null;
  description?: string;
  districtId?: number;
  wardString?: string;
  streetString?: string;
  venue?: string;
  orgName?: string;
  orgDescription?: string;
  categoryIds?: number[];
  imgLogoUrl?: string;
  imgPosterUrl?: string;
}
