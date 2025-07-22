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

export interface EventDescriptionGenDto {
  name: string;
  isOnlineEvent: boolean;
  location?: string;
  venue: string;
  organizer: string;
  organizerDescription: string;
  categories: string[];
}

export interface DescriptionGeneratePayload {
  privatekey: string
  Event: EventDescriptionGenDto;
  description: string;
  userRequest?: string;
  language?: string;
  previouseID?: string;
}

export interface DescriptionGenerateResponse {
  statusCode: number;
  message: string;
  data: string;
  previousID?: string;
}

export interface DescriptionWithAIProps {
  isValid: boolean;
  eventDetails: EventDescriptionGenDto;
  currentDescription?: string;
  onChange: (content: string) => void;
  setIsLoading?: (val: boolean) => void; 
  isLoading?: boolean;
}