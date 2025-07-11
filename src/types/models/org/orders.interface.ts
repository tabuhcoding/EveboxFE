// Define JsonValue type to replace the Prisma import
type JsonValue = 
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

// Define BaseResponse interface to replace the missing import
interface BaseResponse {
  success: boolean;
  message: string;
  statusCode: number;
}

export interface FormInput {
  fieldName: string;
  options?: JsonValue;
}

export interface FormAnswer {
  value: string;
  FormInput: FormInput;
}

export interface FormResponse {
  FormAnswer: FormAnswer[];
}

export interface OrderInfo {
  ticketTypeId: string;
  quantity: number;
  seatId?: number[];
  status: number;
}

export interface PaymentInfo {
  id: number;
  paidAt?: Date;
  OrderInfo: OrderInfo;
}

export interface TicketOrderData {
  id: string;
  status: number;
  price: number;
  type: string;
  mailSent: boolean;
  showingId: string;
  FormResponse?: FormResponse;
  PaymentInfo?: PaymentInfo;
}

export interface GetOrdersResponse extends BaseResponse {
  data: TicketOrderData[];
}