import { BaseApiResponse } from "@/types/baseApiResponse";

export interface TicketDetailProps {
  ticketId: string;
}

export interface IImagesResponseData {
  imageUrl: string;
}

export interface IUserEvent {
  title: string;
  venue: string;
}

export interface IUserShowing {
  startTime: string;
  endTime: string;
  title: string;
  venue: string;
  locationsString: string;
  imageUrl: string;
}

export interface IPaymentInfo {
  paidAt: string;
  method: string;
}

export interface IUserTicketSeat {
  id: string;
  seatname?: string;
  sectionname?: string; 
  description: string;
  qrCode?: string;
  seatID?: string;      
  sectionID?: string;
}

export interface IUserTicketType {
  id: string;
  name: string;
  description: string;
  price: number;
  tickets: IUserTicketSeat[];
}

export interface IUserFormFieldAnswer {
  fieldName: string;
  value: string;
}

export interface IUserTicketById {
  id: string;
  showingId: string;
  status: string;
  type: string;
  price: number;
  createdAt: string;
  PaymentInfo?: IPaymentInfo;
  Showing?: IUserShowing;
  Ticket: IUserTicketType[];
  count: number;
  formResponse: IUserFormFieldAnswer[];
}

export interface IGetUserTicketByIdResponse {
  statusCode: number;
  message: string;
  data: IUserTicketById;
}

export type TicketInfoByIdResponse = BaseApiResponse<IGetUserTicketByIdResponse>;
