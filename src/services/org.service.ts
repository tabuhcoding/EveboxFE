/* Package Application */
import { BaseApiResponse } from "types/baseApiResponse";

import { END_POINT_LIST } from "./endpoint";
import { orgService } from "./instance.service";
import { CreateOrgPaymentInfoDto, OrgPaymentInfoData } from "types/models/org/orgPaymentInfo.interface";
import { CreateShowingDto, CreateShowingResponseDto, DeleteShowingResponseDto, GetAllShowingDetailOfEventResponseDto, UpdateShowingDto, UpdateShowingResponseDto } from "types/models/showing/createShowing.dto";
import { CreateTicketTypeDto, CreateTicketTypeResponseDto, DeleteTicketTypeResponseDto, UpdateTicketTypeDto, UpdateTicketTypeResponseDto } from "types/models/ticketType/ticketType.interface";
import { BasicFormDto, ConnectFormDto, ConnectFormResponseData, ConnectFormResponseDto, GetAllFormForOrgResponseDto } from "types/models/form/form.interface";
import { EventOrgFrontDisplayDto, IEventSummaryData, IShowTime } from "@/types/models/org/orgEvent.interface";
import { AnalyticData } from "@/types/models/org/analytics.interface";
import { EventMember, EventRoleItem } from "@/types/models/org/member.interface";
import { GetOrdersResponse } from "@/types/models/org/orders.interface";

export async function getOrgPaymentInfo(): Promise<OrgPaymentInfoData> {
  if (typeof window === "undefined") {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/org/payment`,
      {
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN || ""}`, // Adjust if SSR uses cookies/session
        },
        next: { revalidate: 60 }, // Optional SSR caching
      }
    );
    if (!res.ok) throw new Error("Failed to fetch organizer payment info");
    const json: BaseApiResponse<OrgPaymentInfoData> = await res.json();
    return json.data;
  } else {
    const res = await orgService.get<BaseApiResponse<OrgPaymentInfoData>>(
      END_POINT_LIST.ORG_PAYMENT.PAYMENT
    );
    if (!res) throw new Error("Failed to fetch organizer payment info");
    return res.data.data;
  }
}


export async function createOrgPaymentInfo(
  dto: CreateOrgPaymentInfoDto
): Promise<{ id: string }> {
  if (typeof window === "undefined") {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/org/payment`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.ACCESS_TOKEN || ""}`,
        },
        body: JSON.stringify(dto),
      }
    );
    if (!res.ok) throw new Error("Failed to create organizer payment info");
    const json: BaseApiResponse<{ id: string }> = await res.json();
    return json.data;
  } else {
    const res = await orgService.post<BaseApiResponse<{ id: string }>>(
      END_POINT_LIST.ORG_PAYMENT.PAYMENT,
      dto
    );
    if (!res) throw new Error("Failed to create organizer payment info");
    return res.data.data;
  }
}

export async function createShowing(
  eventId: number,
  payload: CreateShowingDto
): Promise<string> {
  if (typeof window === "undefined") {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/org/showing/${eventId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.ACCESS_TOKEN || ""}`,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to create showing");
    }

    const json: BaseApiResponse<CreateShowingResponseDto> = await res.json();
    return json.data.data;
  } else {
    const res = await orgService.post<BaseApiResponse<string>>(
      `${END_POINT_LIST.ORG_SHOWING.SHOWING}/${eventId}`,
      payload
    );

    if (!res || res.status !== 201) {
      throw new Error(res?.data?.message || "Failed to create showing");
    }

    console.log("------",res.data);

    return res.data.data;
  }
}

export async function deleteShowing(showingId: string): Promise<DeleteShowingResponseDto> {
  if (typeof window === "undefined") {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/org/showing/${showingId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN || ""}`,
        },
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to delete showing");
    }

    const json: BaseApiResponse<DeleteShowingResponseDto> = await res.json();
    return json.data;
  } else {
    const res = await orgService.delete<BaseApiResponse<DeleteShowingResponseDto>>(
      `${END_POINT_LIST.ORG_SHOWING.SHOWING}/${showingId}`
    );

    if (!res || res.status !== 200) {
      throw new Error(res?.data?.message || "Failed to delete showing");
    }

    return res.data.data;
  }
}

export async function updateShowing(
  showingId: string,
  payload: UpdateShowingDto
): Promise<UpdateShowingResponseDto> {
  if (typeof window === "undefined") {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/org/showing/${showingId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.ACCESS_TOKEN || ""}`,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to update showing");
    }

    const json: BaseApiResponse<UpdateShowingResponseDto> = await res.json();
    return json.data;
  } else {
    const res = await orgService.put<BaseApiResponse<UpdateShowingResponseDto>>(
      `${END_POINT_LIST.ORG_SHOWING.SHOWING}/${showingId}`,
      payload
    );

    if (!res || res.status !== 200) {
      throw new Error(res?.data?.message || "Failed to update showing");
    }

    return res.data.data;
  }
}

export async function createTicketType(
  showingId: string,
  payload: CreateTicketTypeDto
): Promise<CreateTicketTypeResponseDto> {
  const url = `${END_POINT_LIST.ORG_TICKETTYPE.TICKET_TYPE}/create/${showingId}`;

  if (typeof window === "undefined") {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${url}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.ACCESS_TOKEN || ""}`,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to create ticket type");
    }

    const json: BaseApiResponse<CreateTicketTypeResponseDto> = await res.json();
    return json.data;
  } else {
    const res = await orgService.post<BaseApiResponse<CreateTicketTypeResponseDto>>(url, payload);

    if (!res || res.status !== 201) {
      throw new Error(res?.data?.message || "Failed to create ticket type");
    }

    return res.data.data;
  }
}

export async function updateTicketType(
  id: string,
  payload: UpdateTicketTypeDto
): Promise<UpdateTicketTypeResponseDto> {
  const url = `${END_POINT_LIST.ORG_TICKETTYPE.TICKET_TYPE}/${id}`;

  if (typeof window === "undefined") {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.ACCESS_TOKEN || ""}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to update ticket type");
    }

    const json: BaseApiResponse<UpdateTicketTypeResponseDto> = await res.json();
    return json.data;
  } else {
    const res = await orgService.put<BaseApiResponse<UpdateTicketTypeResponseDto>>(url, payload);

    if (!res || res.status !== 200) {
      throw new Error(res?.data?.message || "Failed to update ticket type");
    }

    return res.data.data;
  }
}

export async function deleteTicketType(id: string): Promise<DeleteTicketTypeResponseDto> {
  const url = `${END_POINT_LIST.ORG_TICKETTYPE.TICKET_TYPE}/${id}`;

  if (typeof window === "undefined") {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${process.env.ACCESS_TOKEN || ""}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to delete ticket type");
    }

    const json: BaseApiResponse<DeleteTicketTypeResponseDto> = await res.json();
    return json.data;
  } else {
    const res = await orgService.delete<BaseApiResponse<DeleteTicketTypeResponseDto>>(url);

    if (!res || res.status !== 200) {
      throw new Error(res?.data?.message || "Failed to delete ticket type");
    }

    return res.data.data;
  }
}

export async function getAllShowingDetailOfEvent(
  eventId: number
): Promise<GetAllShowingDetailOfEventResponseDto['data']> {
  const url = `${END_POINT_LIST.ORG_SHOWING.SHOWING}/${eventId}`;

  if (typeof window === "undefined") {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.ACCESS_TOKEN || ""}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to fetch showing details");
    }

    const json: BaseApiResponse<GetAllShowingDetailOfEventResponseDto['data']> = await res.json();
    return json.data;
  } else {
    const res = await orgService.get<BaseApiResponse<GetAllShowingDetailOfEventResponseDto['data']>>(url);

    if (!res || res.status !== 200) {
      throw new Error(res?.data?.message || "Failed to fetch showing details");
    }

    return res.data.data;
  }
}

export async function getAllFormForOrg(): Promise<BasicFormDto[]> {
  const url = END_POINT_LIST.ORG_SHOWING.FORM_ALL;

  if (typeof window === "undefined") {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.ACCESS_TOKEN || ""}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to fetch organizer forms");
    }

    const json: BaseApiResponse<GetAllFormForOrgResponseDto> = await res.json();
    return json.data.forms;
  } else {
    const res = await orgService.get<BaseApiResponse<GetAllFormForOrgResponseDto>>(url);

    if (!res || res.status !== 200) {
      throw new Error(res?.data?.message || "Failed to fetch organizer forms");
    }

    return res.data.data.forms;
  }
}

export async function connectForm(
  dto: ConnectFormDto
): Promise<ConnectFormResponseData> {
  const url = END_POINT_LIST.ORG_SHOWING.FORM_CONNECT;

  if (typeof window === "undefined") {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.ACCESS_TOKEN || ""}`,
      },
      body: JSON.stringify(dto),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to connect form to showing");
    }

    const json: BaseApiResponse<ConnectFormResponseDto> = await res.json();
    return json.data.data;
  } else {
    const res = await orgService.post<BaseApiResponse<ConnectFormResponseData>>(url, dto);

if (!res || res.status !== 200) {
  throw new Error(res?.data?.message || "Failed to connect form to showing");
}

return res.data.data;
  }
}

export async function getEventOfOrg(): Promise<EventOrgFrontDisplayDto[]> {
    const res = await orgService.get<BaseApiResponse<EventOrgFrontDisplayDto[]>>(
      END_POINT_LIST.ORG_EVENT.EVENT
    );

    if (!res || res.status !== 200) {
      throw new Error(res?.data?.message || "Failed to fetch events of organizer");
    }

    return res.data.data;
}

export const getShowingsByEventId = async (eventId: number): Promise<IShowTime[]> => {
  // const endpoint = END_POINT_LIST.ORG_SHOWING.SHOWING_TIME.replace("{eventId}", eventId.toString());
  const res = await orgService.get(`${END_POINT_LIST.ORG_SHOWING.SHOWING}/${eventId}`);

  console.log("fetch showingTime")
  console.log(res)
  if (!res || !res.data) {
    throw new Error('Failed to fetch showing times');
  }
  return res.data.data;
};

// Lấy summary theo showingId
export const getSummaryByShowingId = async (showingId: string): Promise<IEventSummaryData> => {
  // const endpoint = END_POINT_LIST.ORG_STATISTICS.GET_SUMMARY.replace("{showingId}", showingId);

  const res = await orgService.get<BaseApiResponse<IEventSummaryData>>(`${END_POINT_LIST.ORG_STATISTICS.GET_SUMMARY}/${showingId}`);
  console.log("fetch sumarry")
  console.log(res)
  if (!res || !res.data) {
    throw new Error('Failed to fetch event summary');
  }

  return res.data.data;
};

export const getAnalyticByEvent = async (eventId: string, startDate?: string,endDate?: string): Promise<AnalyticData> => {
  const params: Record<string, string> = {};

  if (startDate) {
    params.startDate = startDate;
  }
  if (endDate) {
    params.endDate = endDate;
  }

  const res = await orgService.get(`${END_POINT_LIST.ORG_STATISTICS.GET_ANALYTIC}/${eventId}`, {
    params,
  });

  console.log("fetch analytics", res);

  if (!res || !res.data) {
    throw new Error('Failed to fetch event analytics');
  }

  return res.data.data;
};

export async function getEventMembers(
  eventId: number,
  email?: string
): Promise<EventMember[]> {
  const query = email ? `?email=${encodeURIComponent(email)}` : "";
  const url = `${END_POINT_LIST.ORG_EVENT.MEMBER}/${eventId}${query}`;

  try {
    const res = await orgService.get<BaseApiResponse<EventMember[]>>(url);

    if (!res || res.status !== 200) {
      throw new Error(res?.data?.message || "Failed to fetch event members");
    }

    return res.data.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    console.error("Error fetching event members:", err?.response?.data?.message || error);
    throw new Error(err?.response?.data?.message || "Unexpected error while fetching event members");
  }
}

export async function getEventRoles(): Promise<EventRoleItem[]> {
  if (typeof window === "undefined") {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/event/role`, {
      headers: {
        Authorization: `Bearer ${process.env.ACCESS_TOKEN || ""}`,
      },
      next: { revalidate: 60 }, // Optional SSR caching
    });

    if (!res.ok) throw new Error("Failed to fetch event roles");

    const json: BaseApiResponse<EventRoleItem[]> = await res.json();
    return json.data;
  } else {
    const res = await orgService.get<BaseApiResponse<EventRoleItem[]>>(
      END_POINT_LIST.ORG_EVENT.EVENT_ROLE
    );

    if (!res || res.status !== 200) {
      throw new Error(res?.data?.message || "Failed to fetch event roles");
    }

    return res.data.data;
  }
}

export const getOrdersByShowingId = async (showingId: string): Promise<GetOrdersResponse> => {
  // const endpoint = END_POINT_LIST.ORG_STATISTICS.GET_SUMMARY.replace("{showingId}", showingId);

  const res = await orgService.get(`${END_POINT_LIST.ORG_STATISTICS.GET_ORDERS}/${showingId}`);
  console.log("fetch orders")
  console.log(res)
  if (!res || !res.data) {
    throw new Error('Failed to fetch event orders');
  }

  return res.data.data;
};