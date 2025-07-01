import { ragService } from "./instance.service";
import { BaseApiResponse } from "@/types/baseApiResponse";
import { ChatBoxContentApiResponse, NavigationApiResponse, NavigationPayload } from "@/types/models/dashboard/chatbox.interface";
import { END_POINT_LIST } from "./endpoint";

const isMockMode = process.env.NEXT_PUBLIC_MOCK_API;

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

function mockNavigationReponse(query: string): Promise<BaseApiResponse<NavigationApiResponse>> {
  return new Promise(resolve => {
    setTimeout(() => {
      const response: NavigationApiResponse = {
        Route: '',
        Message: '',
        EventIds: []
      };

      if (query.includes('vé') || query.includes('ticket')) {
        response.Route = 'MY_TICKETS_PAGE';
        response.Message = 'Đây là danh sách vé bạn đã mua (dữ liệu mock)';
      }
      else if (query.includes('sự kiện') || query.includes('event')) {
        if (query.includes('tạo')) {
          response.Route = 'CREATE_EVENT_PAGE';
          response.Message = 'Đi tới trang này để tạo sự kiện'
        }
        else {
          response.Route = 'EVENT_PAGE';
          response.Message = 'Danh sách sự kiện nổi bật (dữ liệu mock)';
        }
      }
      else if (query.includes('hồ sơ') || query.includes('cá nhân')) {
        response.Route = 'PROFILE_PAGE';
        response.Message = 'Đi tới trang thông tin cá nhân';
      }
      else {
        response.Route = 'HOME_PAGE';
        response.Message = `Tôi không hiểu yêu cầu "${query}". Bạn muốn tìm gì?`;
      }

      resolve({
        statusCode: 200,
        data: response,
        message: 'Success'
      });
    }, 500);
  });
}

export async function sendMessageToBotNavigation(payload: NavigationPayload): Promise<BaseApiResponse<NavigationApiResponse>> {
  if (isMockMode) {
    return mockNavigationReponse(payload.query);
  }

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