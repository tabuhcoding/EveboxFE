/* Package Application */
import { eventService } from "./instance.service";
import { END_POINT_LIST } from "./endpoint";
// import { BaseApiResponse } from "types/baseApiResponse";
import { Category, FrontDisplayResponse } from "types/models/dashboard/frontDisplay";

export const getFrontDisplayEvents = async (): Promise<FrontDisplayResponse> => {
  const res = await eventService.get(END_POINT_LIST.EVENT.GET_FRONT_DISPLAY);

  if (!res) throw new Error('Failed to fetch front display events');

  return res.data;
}

export const getAllCategories = async (): Promise<Category[]> => {
  const res = await eventService.get<Category[]>(END_POINT_LIST.EVENT.ALL_CATEGORIES);

  if (res.status !== 200) throw new Error('Failed to fetch categories');

  return res.data;
}