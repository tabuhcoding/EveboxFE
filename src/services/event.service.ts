/* Package Application */
import { SearchEventsResponse } from "@/types/models/dashboard/searchEvents.interface";
import { IForm } from "@/types/models/event/booking/questionForm.interface";
import { BaseApiResponse } from "types/baseApiResponse";
import { Category, Event, FrontDisplayResponse } from "types/models/dashboard/frontDisplay";
import { SearchEventsParams } from "types/models/dashboard/searchEventParams.interface";
import { SeatMap, SeatMapResponse, ShowingData } from "types/models/event/booking/seatmap.interface";
import {
  EventAdminParams,
  EventManagementApiResponse,
  UpdateEventAdminPayload,
  EventDetailAdmin,
} from "@/types/models/admin/eventManagement.interface";

import { SpecialEventAdminParams, SpecialEventApiResponse } from "@/types/models/admin/eventSpecialManagement.interface";

import {
  ShowingApiResponse,
  ShowingAdminParams,
  ShowingDetail,
  ShowingInTicketTypeDetail
} from "@/types/models/admin/showingManagement.interface";

import { GetAllLocationsResponseDto } from "@/types/models/admin/locationManagement.interface";

import { END_POINT_LIST } from "./endpoint";
import { eventService } from "./instance.service";

import { CreateEventDto } from "types/models/event/createEvent.dto";
import { Province } from "types/models/event/location.interface";
import { EventDetailResponse } from "@/types/models/event/eventdetail/event.interface";
import { UpdateEventDto, UpdateEventResponseDto } from "@/types/models/event/updateEvent.interface";

import {
  RawRevenueChartData,
  ProvinceRevenueData,
  RevenueByTicketPriceData,
  OrganizerRevenueData,
  EventRevenueV2Data,
  AppRevenueData,
  EventRevenueData,
  ShowingDetailRevenueData
} from "@/types/models/admin/revenueManagement.interface";

import { CreatedLocationData } from "@/app/(protected)/organizer/create-event/[id]/libs/interface/infoevent.interface";
import { Showing, ConnectShowingToSeatMapPayload, SeatmapResponse } from "@/types/models/org/editSeatmap.interface";

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
      limit: params.limit,
      admin: params.admin
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

export async function getShowingDetailAdmin(id: string, accessToken: string): Promise<BaseApiResponse<ShowingDetail>> {
  try {
    const headers: { [key: string]: string } = {
      'Content-Type': 'application/json',
    };

    if (accessToken && accessToken !== "") {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const res = await eventService.get(`${END_POINT_LIST.ADMIN.SHOWINGS}/${id}`, {
      headers: headers,
    });

    if (!res) throw new Error('Failed to get event detail');

    return res.data as BaseApiResponse<ShowingDetail>;
  } catch (error: any) {
    console.error("Error get showing detail by admin:", error?.response?.data?.message);
    throw new Error(`${error?.response?.data?.message}`);
  }
}

export async function getTicketTypeDetailAdmin(showingId: string, ticketTypeId: string, accessToken: string): Promise<BaseApiResponse<ShowingInTicketTypeDetail>> {
  try {
    const headers: { [key: string]: string } = {
      'Content-Type': 'application/json',
    };

    if (accessToken && accessToken !== "") {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const res = await eventService.get(`${END_POINT_LIST.ADMIN.SHOWINGS}/${showingId}/${ticketTypeId}`, {
      headers: headers
    });

    if (!res) throw new Error('Failed to get ticket type detail by admin');

    return res.data as BaseApiResponse<ShowingInTicketTypeDetail>;
  } catch (error: any) {
    console.error("Error get ticket type detail by admin:", error?.response?.data?.message);
    throw new Error(`${error?.response?.data?.message}`);
  }
}

export async function getSearchEvents({
  title,
  type,
  provinceId,
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
    if (provinceId) params.append("location", provinceId);
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

export interface Location {
  id: number;
  nameVi: string;
  nameEn: string;
}

export const getAllProvinces = async (): Promise<Location[]> => {
  try {
    const res = await eventService.get("/api/location/all-districts");

    if (!res || res.status !== 200) {
      throw new Error("Failed to fetch provinces");
    }

    const provinces: Location[] = res.data.map((province: any) => ({
      id: province.id,
      nameVi: province.name.vi,
      nameEn: province.name.en
    }));

    return provinces;
  } catch (error) {
    console.error("Error fetching provinces:", error);
    throw error;
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
}

export async function getAllLocations(accessToken: string, organizerId?: string, provinceId?: number): Promise<GetAllLocationsResponseDto> {
  const params = new URLSearchParams();
  if (organizerId) params.append("organizerId", organizerId);
  if (provinceId !== undefined) params.append("provinceId", provinceId.toString());

  const headers: { [key: string]: string } = {
    'Content-Type': 'application/json',
  };

  if (accessToken && accessToken !== "") {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  try {
    const res = await eventService.get(`${END_POINT_LIST.LOCATION.GET_ALL_LOCATIONS}?${params.toString()}`, {
      headers: headers
    });

    if (!res || !res.data) {
      throw new Error("Failed to fetch locations");
    }

    return res.data;
  } catch (error) {
    console.error("Error fetching locations:", error);
    throw error;
  }
}

export async function getOrgRevenueChart(accessToken: string, filterType: "month" | "year" = "month", fromDate?: string, toDate?: string): Promise<BaseApiResponse<RawRevenueChartData[]>> {
  try {
    const params = new URLSearchParams();
    if (fromDate) params.append("fromDate", fromDate);
    if (toDate) params.append("toDate", toDate);
    params.append("filterType", filterType);

    const headers: { [key: string]: string } = {
      'Content-Type': 'application/json',
    };

    if (accessToken && accessToken !== "") {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const res = await eventService.get(`${END_POINT_LIST.ADMIN_STATISTICS.GET_REVENUE_CHART_V2}?${params.toString()}`, {
      headers: headers
    });

    if (!res || res.status !== 200) {
      throw new Error('Failed to fetch organizer revenue chart')
    }

    return res.data as BaseApiResponse<RawRevenueChartData[]>;
  } catch (error: any) {
    console.error("Error get organizer revenue chart:", error?.response?.data?.message);
    throw new Error(`${error?.response?.data?.message}`);
  }
}

export async function getOrgRevenueByProvince(accessToken: string): Promise<BaseApiResponse<ProvinceRevenueData[]>> {
  try {
    const headers: { [key: string]: string } = {
      'Content-Type': 'application/json',
    };

    if (accessToken && accessToken !== "") {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const res = await eventService.get(`${END_POINT_LIST.ADMIN_STATISTICS.GET_REVENUE_BY_PROVINCE}-V2`, {
      headers: headers
    });

    if (!res) {
      throw new Error("Failed to fetch organizer revenue by province");
    }

    return res.data as BaseApiResponse<ProvinceRevenueData[]>;
  } catch (error: any) {
    console.error("Error get organizer revenue by province:", error?.response?.data?.message);
    throw new Error(`${error?.response?.data?.message}`);
  }
}

export async function getOrgRevenueByTicketPrice(accessToken: string): Promise<BaseApiResponse<RevenueByTicketPriceData[]>> {
  try {
    const headers: { [key: string]: string } = {
      'Content-Type': 'application/json',
    };

    if (accessToken && accessToken !== "") {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const res = await eventService.get(`${END_POINT_LIST.ADMIN_STATISTICS.GET_REVENUE_BY_TICKETPRICE}-V2`, {
      headers: headers
    });

    if (!res) {
      throw new Error("Failed to fetch organizer revenue by ticket price");
    }

    return res.data as BaseApiResponse<RevenueByTicketPriceData[]>;
  } catch (error: any) {
    console.error("Error get organizer revenue by ticket price:", error?.response?.data?.message);
    throw new Error(`${error?.response?.data?.message}`);
  }
}

export async function getOrgRevenueList(accessToken: string, page: number, limit: number, fromDate?: string, toDate?: string, search?: string): Promise<BaseApiResponse<OrganizerRevenueData[]>> {
  try {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (fromDate) params.append("fromDate", fromDate);
    if (toDate) params.append("toDate", toDate);
    if (search) params.append("search", search);

    const headers: { [key: string]: string } = {
      'Content-Type': 'application/json',
    };

    if (accessToken && accessToken !== "") {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const res = await eventService.get(`${END_POINT_LIST.ADMIN_STATISTICS.GET_ORG_REVENUE}?${params.toString()}`, {
      headers: headers
    });

    if (!res) {
      throw new Error("Failed to fetch organizer revenue");
    }

    return res.data as BaseApiResponse<OrganizerRevenueData[]>;
  } catch (error: any) {
    console.error("Error get organizer revenue:", error?.response?.data?.message);
    throw new Error(`${error?.response?.data?.message}`);
  }
}

export async function getAppRevenue(accessToken: string, fromDate?: string, toDate?: string): Promise<BaseApiResponse<AppRevenueData>> {
  try {
    const params = new URLSearchParams();
    if (fromDate) params.append("fromDate", fromDate);
    if (toDate) params.append("toDate", toDate);

    const headers: { [key: string]: string } = {
      'Content-Type': 'application/json',
    };

    if (accessToken && accessToken !== "") {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const res = await eventService.get(`${END_POINT_LIST.ADMIN_STATISTICS.GET_APP_REVENUE}?${params.toString()}`, {
      headers: headers
    });

    if (!res) {
      throw new Error("Failed to fetch organizer revenue");
    }

    return res.data as BaseApiResponse<AppRevenueData>;
  } catch (error: any) {
    console.error("Error get app revenue:", error?.response?.data?.message);
    throw new Error(`${error?.response?.data?.message}`);
  }
}

export async function getEventRevenueDetail(orgId: string, eventId: number, accessToken: string): Promise<BaseApiResponse<EventRevenueV2Data>> {
  try {
    const headers: { [key: string]: string } = {
      'Content-Type': 'application/json',
    };

    if (accessToken && accessToken !== "") {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const res = await eventService.get(`${END_POINT_LIST.ADMIN_STATISTICS.GET_REVENUE_V2}/${orgId}/${eventId}`, {
      headers: headers
    });

    if (!res || res.status !== 200) {
      throw new Error("Failed to fetch event revenue detail");
    }

    return res.data as BaseApiResponse<EventRevenueV2Data>;
  } catch (error: any) {
    console.error("Error get event revenue detail:", error?.response?.data?.message);
    throw new Error(`${error?.response?.data?.message}`);
  }
}

export async function getEventsRevenue(accessToken: string, page: number, limit: number, fromDate?: string, toDate?: string, search?: string): Promise<BaseApiResponse<EventRevenueData[]>> {
  try {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (fromDate) params.append("fromDate", fromDate);
    if (toDate) params.append("toDate", toDate);
    if (search) params.append("search", search);

    const headers: { [key: string]: string } = {
      'Content-Type': 'application/json',
    };

    if (accessToken && accessToken !== "") {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const res = await eventService.get(`${END_POINT_LIST.ADMIN_STATISTICS.GET_EVENT_REVENUE}?${params.toString()}`, {
      headers: headers
    });

    if (!res || res.status !== 200) {
      throw new Error("Failed to fetch event revenue detail");
    }

    return res.data as BaseApiResponse<EventRevenueData[]>;
  } catch (error: any) {
    console.error("Error get event revenue:", error?.response?.data?.message);
    throw new Error(`${error?.response?.data?.message}`);
  }
}

export async function getRevenueByShowingId(accessToken: string, orgId: string, eventId: number, showingId: string): Promise<BaseApiResponse<ShowingDetailRevenueData>> {
  try {
    const headers: { [key: string]: string } = {
      'Content-Type': 'application/json',
    };

    if (accessToken && accessToken !== "") {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const res = await eventService.get(`${END_POINT_LIST.ADMIN_STATISTICS.GET_REVENUE}/${orgId}/${eventId}/${showingId}`);

    if (!res || res.status !== 200) {
      throw new Error("Failed to fetch event revenue detail");
    }

    return res.data as BaseApiResponse<ShowingDetailRevenueData>;
  } catch (error: any) {
    console.error("Error get revenue by showing id:", error?.response?.data?.message);
    throw new Error(`${error?.response?.data?.message}`);
  }
}

export async function getRevenueByOrgId(orgId: string, accessToken: string): Promise<BaseApiResponse<OrganizerRevenueData>> {
  try {
    const headers: { [key: string]: string } = {
      'Content-Type': 'application/json',
    };

    if (accessToken && accessToken !== "") {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const res = await eventService.get(`${END_POINT_LIST.ADMIN_STATISTICS.GET_REVENUE}/${orgId}`, {
      headers: headers
    });

    if (!res || res.status !== 200) {
      throw new Error("Failed to fetch event revenue detail");
    }
    return res.data as BaseApiResponse<OrganizerRevenueData>;
  } catch (error: any) {
    console.error("Error get revenue by org id:", error?.response?.data?.message);
    throw new Error(`${error?.response?.data?.message}`);
  }
}

export async function getCreatedLocationsOfOrg(accessToken: string): Promise<BaseApiResponse<CreatedLocationData[]>> {
  try {
    const headers: { [key: string]: string } = {
      'Content-Type': 'application/json',
    };

    if (accessToken && accessToken !== "") {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const res = await eventService.get(END_POINT_LIST.LOCATION.GET_ORG_LOCATIONS, {
      headers: headers
    });

    if (!res || res.status !== 200) {
      throw new Error("Failed to fetch event revenue detail");
    }
    
    return res.data as BaseApiResponse<CreatedLocationData[]>;
  } catch (error: any) {
    console.error("Error get revenue by org id:", error?.response?.data?.message);
    throw new Error(`${error?.response?.data?.message}`);
  }
}

export async function getShowingsOfEvent(eventId: number, accessToken: string): Promise<BaseApiResponse<Showing[]>> {
  try {
    const headers: { [key: string]: string } = {
      'Content-Type': 'application/json',
    };

    if (accessToken && accessToken !== "") {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const res = await eventService.get(`${END_POINT_LIST.ORG_SHOWING.SHOWING}/${eventId}`, {
      headers: headers,
    })

    if (!res || res.status !== 200) {
      throw new Error("Failed to fetch event revenue detail");
    }
    
    return res.data as BaseApiResponse<Showing[]>;
  } catch (error: any) {
    console.error("Error showings of event:", error?.response?.data?.message);
    throw new Error(`${error?.response?.data?.message}`);
  }
}

export async function connectShowingToSeatmap(payload: ConnectShowingToSeatMapPayload, accessToken: string): Promise<BaseApiResponse<any>> {
  try {
    const headers: { [key: string]: string } = {
      'Content-Type': 'application/json',
    };

    if (accessToken && accessToken !== "") {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const res = await eventService.post(END_POINT_LIST.SHOWING.SEATMAP_CONNECT, payload, {
      headers: headers
    });

    if (!res || res.status !== 200) {
      throw new Error("Failed to fetch event revenue detail");
    }
    
    return res.data;
  } catch (error: any) {
    console.error("Error connect showing to seatmap:", error?.response?.data?.message);
    throw new Error(`${error?.response?.data?.message}`);
  }
}

export async function getAllSeatmaps(showingId: string): Promise<BaseApiResponse<SeatmapResponse[]>> {
  try {
    const res = await eventService.get(`${END_POINT_LIST.SHOWING.GET_ALL_SEATMAP}/${showingId}`);

    if (!res || res.status !== 200) {
      throw new Error("Failed to fetch all seatmaps");
    }

    return res.data as BaseApiResponse<SeatmapResponse[]>;
  } catch (error: any) {
    console.error("Error get all seatmap:", error?.response?.data?.message);
    throw new Error(`${error?.response?.data?.message}`);
  }
}

export async function getSeatmapDetail(id: number, showingId: string): Promise<BaseApiResponse<SeatMap>> {
  try {
    const res = await eventService.get(`${END_POINT_LIST.SHOWING.GET_SEATMAP_DETAIL}/${id}?showingId=${showingId}`);

    if (!res || res.status !== 200) {
      throw new Error("Failed to fetch all seatmaps");
    }

    return res.data as BaseApiResponse<SeatMap>;
  } catch (error: any) {
    console.error("Error get seatmap detail:", error?.response?.data?.message);
    throw new Error(`${error?.response?.data?.message}`);
  }
}