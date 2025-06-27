export interface SearchEventsParams {
  title: string;
  type?: string;    
  provinceId?: string,   
  startDate?: string;  // in YYYY-MM-DD format
  endDate?: string;    // in YYYY-MM-DD format
  minPrice?: number;
  maxPrice?: number;
  pages:number;
  limit: number
}