import { DescriptionGeneratePayload, DescriptionGenerateResponse } from "@/types/models/event/createEvent.dto";
import { END_POINT_LIST } from "@/services/endpoint";
import { ragService } from "@/services/instance.service";
// import { GenerationProps } from "../../../components/info-event/components/descriptionWithAI"

export async function generateDescription(payload: DescriptionGeneratePayload, accessToken: string): Promise<DescriptionGenerateResponse> {
  const headers: { [key: string]: string } = {
      'Content-Type': 'application/json',
    };

    if (accessToken && accessToken !== "") {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

  try {
    const res = await ragService.post(`${END_POINT_LIST.RAG.RAG_SERVICE}/description-generate`, payload, {
      headers: headers
    });

    if (!res.data || res.status < 200 || res.status >= 300) {
      throw new Error(res.data?.message || 'Failed to generate description');
    }

    return res.data as DescriptionGenerateResponse;
  } catch (error: any) {
    const errorMsg = error.response?.data?.message ||
      error.message ||
      'Failed to generate description';

    // Phân loại lỗi cụ thể
    if (errorMsg.includes('quota')) {
      throw new Error('Hệ thống AI đang quá tải, vui lòng thử lại sau');
    } else if (errorMsg.includes('Unauthorized')) {
      throw new Error('Bạn không có quyền sử dụng tính năng này');
    } else {
      throw new Error(errorMsg);
    }
  }
}

// export const generateDescripton = async(generationForm: GenerationProps) => {
//   try {
//     const response = await fetch(`${process.env.NEXT_PUBLIC_API_AI_URL}/description-generate`, {
//       method: 'POST',
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify(generationForm)
//     });

//     if (!response.ok) {
//       throw new Error('Error generating description');
//     }

//     const data = await response.json();
//     return data.result.answer;
//     return
//   } catch (error) {
//     console.error('Error generating description', error);
//     return null;
//   }
// }