export interface BaseApiResponse<T = unknown> {
  statusCode: number;
  message: string;
  data: T;
  status?: number;
  pagination?: PaginationData;
}

export interface PaginationData {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}