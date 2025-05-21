/* Package Application */
import { Category, FrontDisplayResponse } from "types/models/dashboard/frontDisplay";

import { END_POINT_LIST } from "./endpoint";
import { eventService } from "./instance.service";
// import { BaseApiResponse } from "types/baseApiResponse";

export async function getFrontDisplayEvents(): Promise<FrontDisplayResponse> {
  // Kiểm tra: Nếu là server component thì dùng fetch ISR, còn lại dùng axios
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