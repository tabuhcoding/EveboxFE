export interface BaseApiResponse<T = unknown> {
  statusCode: number;
  message: string;
  data: T;
  status?: number;
}