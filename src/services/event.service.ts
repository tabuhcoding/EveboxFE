/* Package Application */
import { IForm } from "@/types/models/event/booking/questionForm.interface";
import { BaseApiResponse } from "types/baseApiResponse";
import { Category, Event, FrontDisplayResponse } from "types/models/dashboard/frontDisplay";
import { SeatMapResponse, ShowingData } from "types/models/event/booking/seatmap.interface";

import { END_POINT_LIST } from "./endpoint";
import { eventService } from "./instance.service";

export async function getFrontDisplayEvents(): Promise<FrontDisplayResponse> {
  if (typeof window === "undefined") {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/event/front-display`,
      {
        next: { revalidate: 60 },
      }
    );
    if (!res.ok) throw new Error("Failed to fetch front display events");
    return res.json();
  } else {
    const res = await eventService.get(END_POINT_LIST.EVENT.GET_FRONT_DISPLAY);
    if (!res) throw new Error("Failed to fetch front display events");
    return res.data;
  }
}

export const getAllCategories = async (): Promise<Category[]> => {
  const res = await eventService.get<Category[]>(END_POINT_LIST.EVENT.ALL_CATEGORIES);

  if (res.status !== 200) throw new Error('Failed to fetch categories');

  return res.data;
}

export const getRecommendedEvents = async (timeWindow: string): Promise<BaseApiResponse<Event[]>> => {
  const res = await eventService.get(END_POINT_LIST.EVENT.GET_RECOMMENDED_EVENTS, {
    params: { timeWindow }
  });

  if (!res) throw new Error('Failed to fetch recommended events');

  return res.data;
}

export async function getSeatMap(showingId: string): Promise<SeatMapResponse | null> {
  try {
    const res = await eventService.get(`${END_POINT_LIST.SHOWING.GET_SEAT_MAP}?showingId=${showingId}`)

    if (!res) throw new Error('Failed to get seat map');

    return res.data;
  } catch (error) {
    console.error("Error fetching seat map:", error);
    return null;
  }
}

export async function getShowingData(showingId: string): Promise<BaseApiResponse<ShowingData> | null> {
  try {
    const res = await eventService.get(`${END_POINT_LIST.SHOWING.GET_SHOWING}?showingId=${showingId}`);

    if (!res) throw new Error('Failed to get showing data');

    return res.data;
  } catch (error) {
    console.error("Error fetching showing data:", error);
    return null;
  }
}

export async function getFormOfShowing(showingId: string): Promise<BaseApiResponse<IForm> | null> {
  try {
    const res = await eventService.get(`${END_POINT_LIST.SHOWING.GET_FORM}?showingId=${showingId}`);

    console.log("🚀 ~ getFormOfShowing ~ res:", res)
    if (!res) throw new Error('Failed to get form of showing, please try again later');

    return res.data;
  } catch (error: any) {
    console.error("Error selecting seat:", error?.response?.data?.message);
    throw new Error(`${error?.response?.data?.message}`);
  }
}