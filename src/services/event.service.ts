/* Package Application */
import { SearchEventsResponse } from "@/types/models/dashboard/searchEvents.interface";
import { IForm } from "@/types/models/event/booking/questionForm.interface";
import { BaseApiResponse } from "types/baseApiResponse";
import { Category, Event, FrontDisplayResponse } from "types/models/dashboard/frontDisplay";
import { SearchEventsParams } from "types/models/dashboard/searchEventParams.interface";
import { SeatMapResponse, ShowingData } from "types/models/event/booking/seatmap.interface";
import {
  EventAdminParams,
  EventManagementApiResponse,
  UpdateEventAdminPayload,
  EventDetailAdmin,
} from "@/types/models/admin/eventManagement.interface";

import { SpecialEventAdminParams, SpecialEventApiResponse } from "@/types/models/admin/eventSpecialManagement.interface";

import { ShowingApiResponse, ShowingAdminParams } from "@/types/models/admin/showingManagement.interface";

import { END_POINT_LIST } from "./endpoint";
import { eventService } from "./instance.service";

import { CreateEventDto } from "types/models/event/createEvent.dto";
import { Province } from "types/models/event/location.interface";
import { EventDetailResponse } from "@/types/models/event/eventdetail/event.interface";
import { UpdateEventDto, UpdateEventResponseDto } from "@/types/models/event/updateEvent.interface";

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

    if (!res) throw new Error('Failed to get form of showing, please try again later');

    return res.data;
  } catch (error: any) {
    console.error("Error get form of showing:", error?.response?.data?.message);
    throw new Error(`${error?.response?.data?.message}`);
  }
}

export async function getEventsAdmin(params: EventAdminParams, accessToken: string): Promise<BaseApiResponse<EventManagementApiResponse>> {
  try {
    const cleanedEntries = Object.entries(params).filter(([_, value]) => value !== undefined);
    const cleanedParams = {
      ...Object.fromEntries(cleanedEntries),
      page: params.page,
      limit: params.limit
    } as EventAdminParams;

    const headers: { [key: string]: string } = {
      'Content-Type': 'application/json',
    };

    if (accessToken && accessToken !== "") {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const res = await eventService.get(END_POINT_LIST.ADMIN.EVENTS, {
      params: cleanedParams,
      headers: headers,
    });

    if (!res) throw new Error('Failed to get events by admin');

    return res.data as BaseApiResponse<EventManagementApiResponse>;
  } catch (error: any) {
    console.error("Error get events by admin:", error?.response?.data?.message);
    throw new Error(`${error?.response?.data?.message}`);
  }
}

export async function getSpecialEventsManagment(params: SpecialEventAdminParams, accessToken: string): Promise<BaseApiResponse<SpecialEventApiResponse>> {
  try {
    const cleanedEntries = Object.entries(params).filter(([_, value]) => value !== undefined);
    const cleanedParams = {
      ...Object.fromEntries(cleanedEntries),
      page: params.page,
      limit: params.limit
    } as SpecialEventAdminParams;

    const headers: { [key: string]: string } = {
      'Content-Type': 'application/json',
    };

    if (accessToken && accessToken !== "") {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const res = await eventService.get(END_POINT_LIST.ADMIN.EVENTS_SPECIAL, {
      params: cleanedParams,
      headers: headers,
    });

    if (!res) throw new Error('Failed to get special events by admin');

    return res.data as BaseApiResponse<SpecialEventApiResponse>;
  } catch (error: any) {
    console.error("Error get special events by admin:", error?.response?.data?.message);
    throw new Error(`${error?.response?.data?.message}`);
  }
}

export async function updateEventAdmin(eventId: number, payload: UpdateEventAdminPayload, accessToken: string): Promise<BaseApiResponse<boolean>> {
  try {
    const headers: { [key: string]: string } = {
      'Content-Type': 'application/json',
    };

    if (accessToken && accessToken !== "") {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const res = await eventService.put(`${END_POINT_LIST.ADMIN.EVENTS}/${eventId}`, payload, {
      headers: headers
    });

    if (!res) throw new Error('Failed to update event by admin');

    return res.data as BaseApiResponse<boolean>;
  } catch (error: any) {
    console.error("Error update event by admin:", error?.response?.data?.message);
    throw new Error(`${error?.response?.data?.message}`);
  }
}

export async function getEventDetailAdmin(eventId: number, accessToken?: string): Promise<BaseApiResponse<EventDetailAdmin>> {
  try {
    const headers: { [key: string]: string } = {
      'Content-Type': 'application/json',
    };

    if (accessToken && accessToken !== "") {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const res = await eventService.get(`${END_POINT_LIST.ADMIN.EVENT_DETAIL}?eventId=${eventId}`, {
      headers: headers,
    });

    if (!res) throw new Error('Failed to get event detail');

    return res.data as BaseApiResponse<EventDetailAdmin>;
  } catch (error: any) {
    console.error("Error get event detail by admin:", error?.response?.data?.message);
    throw new Error(`${error?.response?.data?.message}`);
  }
}

export async function getShowingsByAdmin(params: ShowingAdminParams, accessToken: string): Promise<BaseApiResponse<ShowingApiResponse>> {
  try {
    const cleanedEntries = Object.entries(params).filter(([_, value]) => value !== undefined);
    const cleanedParams = {
      ...Object.fromEntries(cleanedEntries),
      page: params.page,
      limit: params.limit
    } as ShowingAdminParams;

    const headers: { [key: string]: string } = {
      'Content-Type': 'application/json',
    };

    if (accessToken && accessToken !== "") {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const res = await eventService.get(END_POINT_LIST.ADMIN.SHOWINGS, {
      params: cleanedParams,
      headers: headers,
    });

    if (!res) throw new Error('Failed to get showings by admin');

    return res.data as BaseApiResponse<ShowingApiResponse>;
  } catch (error: any) {
    console.error("Error get showings by admin:", error?.response?.data?.message);
    throw new Error(`${error?.response?.data?.message}`);
  }
}

export async function getSearchEvents({
  title,
  type,
  startDate,
  endDate,
  minPrice,
  maxPrice,
  pages = 1,
  limit = 10
}: SearchEventsParams): Promise<SearchEventsResponse> {
  try {
    const params = new URLSearchParams();
    params.append("title", title);
    if (type) params.append("type", type);
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    if (minPrice !== undefined) params.append("minPrice", minPrice.toString());
    if (maxPrice !== undefined) params.append("maxPrice", maxPrice.toString());

    const res = await eventService.get(`${END_POINT_LIST.EVENT.GET_SEARCH_EVENT}?${params.toString()}&page=${pages}&limit=${limit}`);

    if (!res) throw new Error('Failed to search events, please try again later');
    return res.data;

  } catch (error: any) {
    console.error("Error search: ", error?.response?.data?.message);
    throw new Error(`${error?.response?.data?.message}`);
  }
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

export async function updateEvent(
  eventId: number,
  payload: UpdateEventDto,
): Promise<BaseApiResponse<UpdateEventResponseDto["data"]>> {
  const url = `${END_POINT_LIST.ORG_EVENT.EVENT}/${eventId}`;

  try {
    const res = await eventService.put<BaseApiResponse<UpdateEventResponseDto["data"]>>(url, payload);

    if (res.status !== 200) {
      throw new Error(res?.data?.message || "Failed to update event");
    }

    return res.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    console.error("Error updating event:", err?.response?.data?.message || error);
    throw new Error(err?.response?.data?.message || "Unexpected error while updating event");
  }
}

export async function getAllDistricts(): Promise<Province[]> {
  if (typeof window === "undefined") {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/location/all-districts`,
      {
        next: { revalidate: 60 }, // Optional SSR caching
      }
    );

    if (!res.ok) throw new Error("Failed to fetch all districts");

    const json: Province[] = await res.json();
    return json;
  } else {
    const res = await eventService.get<Province[]>(
      END_POINT_LIST.LOCATION.GET_ALL_DISTRICTS
    );

    if (!res) throw new Error("Failed to fetch all districts");
    console.log("=-------:", res.data);

    return res.data;
  }
}

export const getEventDetail = async (
  eventId: number,
): Promise<EventDetailResponse> => {
  const url = `${END_POINT_LIST.EVENT.GET_EVENT_DETAIL}?eventId=${eventId}`;

  if (typeof window === "undefined") {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.ACCESS_TOKEN || ""}`,
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 }, // optional SSR caching
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to fetch event details");
    }

    return res.json() as Promise<EventDetailResponse>;
  } else {
    const res = await eventService.get<EventDetailResponse>(url);

    if (!res || res.status !== 200) {
      throw new Error(res?.data?.message || "Failed to fetch event details");
    }

    return res.data;
  }
};

