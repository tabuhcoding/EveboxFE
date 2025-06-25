import { BaseApiResponse } from "../baseApiResponse";

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: number;
  avatar_id?: number;
  receiveNoti: boolean;
}

export type UserInfoResponse = BaseApiResponse<UserInfo>;