import createApiClient from "@/services/apiClient";
import { IGetUserTicketByIdResponse } from "@/types/models/ticket/ticketInfoById";

const apiClient = createApiClient(process.env.NEXT_PUBLIC_API_TICKET_SVC_URL || "");
export async function fetchTicketById(id: string) {
  try {
    const response = await apiClient.get<IGetUserTicketByIdResponse>(`/api/ticket/getUserTicketById/${id}`);
    //console.log(response.data.data);
    return response.data.data || null;
  } catch (error) {
    console.error("Error fetching ticket details:", error);
    return null;
  }
}
