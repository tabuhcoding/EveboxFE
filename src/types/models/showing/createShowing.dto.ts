export interface CreateShowingDto {
  startTime: string; // ISO format
  endTime: string;
}

export interface CreateShowingResponseDto {
  showingId: string;
}

export interface DeleteShowingResponseDto {
  showingId: string;
}

export interface UpdateShowingDto {
  startTime?: string;
  endTime?: string;
}

export interface UpdateShowingResponseDto {
  showingId: string;
}