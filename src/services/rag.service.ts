import { ragService } from "./instance.service";
import { BaseApiResponse } from "@/types/baseApiResponse";
import { ChatBoxContentApiResponse, NavigationApiResponse, NavigationPayload } from "@/types/models/dashboard/chatbox.interface";
import { END_POINT_LIST } from "./endpoint";

export async function fetchContent(setIsError: (isError: boolean) => void): Promise<ChatBoxContentApiResponse | null> {
  try {
    const res = await ragService.get(`${END_POINT_LIST.RAG.RAG_SERVICE}/content`);

    if (res.status < 200 || res.status >= 300) {
      setIsError(true);
      console.error('Lỗi khi lấy dữ liệu của chat bot', res.statusText);
      return null;
    }

    return res.data;
  } catch (error) {
    setIsError(true);
    console.error('Lỗi khi lấy dữ liệu của chat bot', error);
    return null;
  }
}

export async function sendMessageToBotNavigation(payload: NavigationPayload): Promise<BaseApiResponse<NavigationApiResponse>> {

  try {
    const res = await ragService.post(`${END_POINT_LIST.RAG.RAG_SERVICE}/navigation`, payload);

    if (!res || res.status < 200 || res.status >= 300) {
      throw new Error('Failed to send message to bot navigation');
    }

    return res.data as BaseApiResponse<NavigationApiResponse>;
  } catch (error: any) {
    const errorMsg = error.response?.data?.error ||
      error.message ||
      'Lỗi khi gửi tin nhắn';

    // Phân loại lỗi cụ thể
    if (errorMsg.includes('quota') || errorMsg.includes('server')) {
      throw new Error('Hệ thống đang quá tải, vui lòng thử lại sau');
    } else if (errorMsg.includes('TLS')) {
      throw new Error('Lỗi kết nối bảo mật');
    } else {
      throw new Error(errorMsg);
    }
  }
}