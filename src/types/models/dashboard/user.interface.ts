import { BaseApiResponse } from "types/baseApiResponse";

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: number;
  avatar_id?: number;
}
// Response for API api/user/me
export type UserInfoResponse = BaseApiResponse<UserInfo>;

export interface UserFavEvent {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
}

export type UserFavEventResponse = BaseApiResponse<UserFavEvent[]>;

