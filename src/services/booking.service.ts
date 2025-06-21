import { BaseApiResponse } from "@/types/baseApiResponse";
import { AnswersFormPayload, AnswerFormRespone } from "@/types/models/event/booking/questionForm.interface";
import { SelectSeatPayload } from "@/types/models/event/booking/seatmap.interface";
import { RedisInfo } from "@/types/models/event/redisSeat";

import { END_POINT_LIST } from "./endpoint";
import { bookingService } from "./instance.service";

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
    console.error("Error unselect seat seat:", error?.response?.data?.message);
    throw new Error(`${error?.response?.data?.message}`);
  }
}