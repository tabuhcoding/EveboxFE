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
  method: string;
}

export interface TicketTypeInfo {
  id: string;
  tickets: Ticket[];
}

export interface Ticket {
  id: string;
  seatId: string;
  sectionID: string;
  qrCode: string;
  description: string;
}



export interface TicketOrderData {
  id: string;
  status: string;
  price: number;
  type: string;
  mailSent: boolean;
  showingId: string;
  formResponse?: FormResponse;
  paymentInfo?: PaymentInfo;
  Ticket?: TicketTypeInfo[];
}

export interface GetOrdersResponse extends BaseResponse {
  data: TicketOrderData[];
}