import { BaseApiResponse } from "@/types/baseApiResponse";
import { AnswersFormPayload, AnswerFormRespone } from "@/types/models/event/booking/questionForm.interface";
import { SelectSeatPayload } from "@/types/models/event/booking/seatmap.interface";
import { RedisInfo } from "@/types/models/event/redisSeat";
import { IGetUserTicketByIdResponse } from "@/types/models/ticket/ticketInfoById";

import { END_POINT_LIST } from "./endpoint";
import { bookingService } from "./instance.service";
import { IGetUserTicketResponse } from "@/types/models/ticket/ticketInfo";

export async function selectSeat(payload: SelectSeatPayload, accessToken: string): Promise<BaseApiResponse<boolean>> {
  try {
    const res = await bookingService.post(END_POINT_LIST.BOOKING.SELECT_SEAT, payload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      }
    });

    if (!res) throw new Error('Failed to select seat');

    return res.data as BaseApiResponse<boolean>;
  } catch (error: any) {
    console.error("Error selecting seat:", error?.response?.data?.message);
    throw new Error(`${error?.response?.data?.message}`);
  }
}

export async function submitForm(payload: AnswersFormPayload, accessToken: string): Promise<BaseApiResponse<AnswerFormRespone>> {
  try {
    const res = await bookingService.post(END_POINT_LIST.BOOKING.SUBMIT_FORM, payload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      }
    });

    if (!res) throw new Error('Failed to submit form');

    return res.data as BaseApiResponse<AnswerFormRespone>;
  } catch (error: any) {
    console.error("Error submit form:", error?.response?.data?.message);
    throw new Error(`${error?.response?.data?.message}`);
  }
}

export async function getRedisSeat(showingId: string): Promise<BaseApiResponse<RedisInfo> | null> {
  try {
    const res = await bookingService.get(`${END_POINT_LIST.BOOKING.GET_REDIS_SEAT}?showingId=${showingId}`);

    if (!res) throw new Error('Failed to get redis seat of showing');

    return res.data as BaseApiResponse<RedisInfo>;
  } catch (error: any) {
    console.error("Error get redis seat:", error?.response?.data?.message);
    throw new Error(`${error?.response?.data?.message}`);
  }
}

export async function unselectSeat(showingId: string, accessToken: string): Promise<BaseApiResponse<boolean> | null> {
  try {
    const res = await bookingService.delete(`${END_POINT_LIST.BOOKING.UNSELECT_SEAT}/${showingId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      }
    });

    if (!res) throw new Error('Failed to unselect seat');

    return res.data as BaseApiResponse<boolean>;
  } catch (error: any) {
    console.error("Error unselect seat:", error?.response?.data?.message);
    throw new Error(`${error?.response?.data?.message}`);
  }
}

export async function getTicketById(id: string, accessToken: string): Promise<IGetUserTicketByIdResponse> {
  try {
    const res = await bookingService.get(`${END_POINT_LIST.BOOKING.GET_ORDER_BY_ID}?orderId=${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      }
    });

    if (!res) throw new Error('Failed to get ticket by id');

    return res.data as IGetUserTicketByIdResponse;
  } catch (error: any) {
    console.error("Error get ticket by id:", error?.response?.data?.message);
    throw new Error(`${error?.response?.data?.message}`);
  }
}

export async function getUserTicketResponse(params: string, accessToken: string): Promise<IGetUserTicketResponse> {
  try {
    const res = await bookingService.get(`${END_POINT_LIST.BOOKING.GET_USER_ORDER}?${params}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      }
    });

    if (!res)  throw new Error('Failed to get user order');

    return res.data as IGetUserTicketResponse;
  } catch (error: any) {
    console.error("Error get ticket by id:", error?.response?.data?.message);
    throw new Error(`${error?.response?.data?.message}`);
  }
}

export async function receiveTicket(key: string): Promise<BaseApiResponse<boolean>> {
  try {
    const encodedKey = encodeURIComponent(key)
      .replace(/%2B/g, '+') // Giữ lại dấu + vì BE không decode
      .replace(/%2F/g, '/') // Giữ lại dấu / nếu có
      .replace(/%3D/g, '=');

    const headers: { [key: string]: string } = {
      'Content-Type': 'application/json',
    };

    if (key && key !== "") {
      headers['x-send-key'] = encodedKey;
    }

    const res = await bookingService.post(END_POINT_LIST.BOOKING.RECEIVE_TICKET, null, {
      headers: headers
    });

    if (!res) throw new Error('Failed to receive ticket');

    return res.data as BaseApiResponse<boolean>;
  } catch (error: any) {
    console.error("Error get ticket by id:", error?.response?.data?.message);
    throw new Error(`${error?.response?.data?.message}`);
  }
}