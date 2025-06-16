/* Package Application */
import { BaseApiResponse } from "types/baseApiResponse";
import { Category, Event, FrontDisplayResponse } from "types/models/dashboard/frontDisplay";

import { END_POINT_LIST } from "./endpoint";
import { eventService } from "./instance.service";
import { CreateEventDto } from "types/models/event/createEvent.dto";
import { Province } from "types/models/event/location.interface";
import { resendOtp } from "./auth.service";

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

export async function createEvent(payload: CreateEventDto, accessToken?: string): Promise<{ id: number }> {
  if (typeof window === "undefined") {
    // SSR (e.g., for API routes or static rendering)
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/org/event`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken || process.env.ACCESS_TOKEN || ""}`,
      },
      body: JSON.stringify(payload),
      next: { revalidate: 0 }, // optional
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to create event");
    }

    const json: BaseApiResponse<{ id: number }> = await res.json();
    return json.data;
  } else {
    // CSR (e.g., from browser)
    const res = await eventService.post<BaseApiResponse<{ id: number }>>(
      END_POINT_LIST.ORG_EVENT.EVENT,
      payload
    );
    if (!res) throw new Error("Failed to create event");
    return res.data.data;
  }
}

export async function getAllDistricts(): Promise<BaseApiResponse<Province[]>> {
  if (typeof window === "undefined") {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/location/all-districts`,
      {
        next: { revalidate: 60 }, // Optional SSR caching
      }
    );

    if (!res.ok) throw new Error("Failed to fetch all districts");

    const json: BaseApiResponse<Province[]> = await res.json();
    return json;
  } else {
    const res = await eventService.get<BaseApiResponse<Province[]>>(
      END_POINT_LIST.LOCATION.GET_ALL_DISTRICTS
    );

    if (!res) throw new Error("Failed to fetch all districts");
    console.log("=-------:", res.data);

    return res.data;
  }
}