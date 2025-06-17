import { BaseApiResponse } from "@/types/baseApiResponse";

export interface IImagesResponseData {
  imageUrl: string;
}

export interface IUserEvent {
  title: string;
  venue: string;
  Images_Events_imgPosterIdToImages: IImagesResponseData;
}

export interface IUserShowing {
  startTime: Date;
  endTime: Date;
  Events: IUserEvent;
}

export interface IUserFormInput {
  fieldName: string;
}

export interface IUserFormAnswer {
  FormInput: IUserFormInput;
  value: string;
}

export interface IUserFormResponse {
  FormAnswer: IUserFormAnswer[];
}

export interface IPaymentInfo {
  paidAt: Date;
  method: string;
}

export interface ITicketQRCode {
  qrCode: string;
  ticketTypeId: string;
  seatId?: number;
}

export interface ITicketType {
  name: string;
  price: number;
}

export interface ISection {
  name: string;
  id: number;
}

export interface IRow {
  id: number;
  name: string;
  Section: ISection;
}

export interface ISeat {
  id: number;
  name: string;
  Row: IRow;
}

export interface IUserTicketById {
  id: string;
  showingId: string;
  status: number;
  type: string;
  price: number;
  PaymentInfo?: IPaymentInfo;
  TicketQRCode?: ITicketQRCode[];
  Showing?: IUserShowing;
  FormResponse: IUserFormResponse;
  ticketType: ITicketType;
  seats: ISeat[];
  count: number;
}

export interface IGetUserTicketByIdResponse {
  statusCode: number;
  message: string;
  data: IUserTicketById;
}

export type TicketInfoByIdResponse = BaseApiResponse<IGetUserTicketByIdResponse>;
