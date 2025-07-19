import { UserInfo } from './../types/models/userInfo';
/* Package Application */
import { UserFavEvent } from "@/types/models/dashboard/user.interface";
import { BaseApiResponse } from "types/baseApiResponse";

import { END_POINT_LIST } from "./endpoint";
import { authService } from "./instance.service";
import {
  ForgotPasswordResponse,
  RegisterPayloadProps,
  RegisterResponse,
  VerifyOtpPayloadProps,
  VerifyOtpResponse,
  ResendOtpPayloadProps,
  ResendOtpResponse,
  ResetPasswordPayloadProps,
  ResetPasswordResponse,
  ChangePasswordPayloadProps,
  ChangePasswordResponse,
  ToggleNotificationResponse,
  EventOrOrgFavouriteData,
  AddEventOrOrgFavouritePayload,
}
  from "./interface/auth.interface";

import { UserAdminApiResponse, UserAdminParams, User } from "@/types/models/admin/accountManagement.interface";
import { UserInfoResponse } from "@/types/models/userInfo";

export const forgotPassword = async (email: string): Promise<BaseApiResponse<ForgotPasswordResponse>> => {
  const result = await authService.post<BaseApiResponse<ForgotPasswordResponse>>(END_POINT_LIST.USER.FORGOT_PASSWORD, { email });
  return result.data;
};

export const register = async (payload: RegisterPayloadProps): Promise<BaseApiResponse<RegisterResponse>> => {
  const result = await authService.post<BaseApiResponse<RegisterResponse>>(END_POINT_LIST.USER.REGISTER, payload);
  return result.data;
};

export const verifyOtp = async (payload: VerifyOtpPayloadProps): Promise<BaseApiResponse<VerifyOtpResponse>> => {
  const result = await authService.post<BaseApiResponse<VerifyOtpResponse>>(END_POINT_LIST.USER.VERIFY_OTP, payload);
  return result.data;
}

export const resendOtp = async (payload: ResendOtpPayloadProps): Promise<BaseApiResponse<ResendOtpResponse>> => {
  const result = await authService.post<BaseApiResponse<ResendOtpResponse>>(END_POINT_LIST.USER.RESEND_OTP, payload);
  return result.data;
};

export const resetPassword = async (payload: ResetPasswordPayloadProps): Promise<BaseApiResponse<ResetPasswordResponse>> => {
  const result = await authService.post<BaseApiResponse<ResetPasswordResponse>>(END_POINT_LIST.USER.RESET_PASSWORD, payload);
  return result.data;
};

export const changePassword = async (payload: ChangePasswordPayloadProps): Promise<BaseApiResponse<ChangePasswordResponse>> => {
  const result = await authService.post<BaseApiResponse<ChangePasswordResponse>>(END_POINT_LIST.USER.CHANGE_PASSWORD, payload);
  return result.data;
};

export const toggleNotification = async (isReceived: boolean): Promise<BaseApiResponse<ToggleNotificationResponse>> => {
  const result = await authService.post(
    `${END_POINT_LIST.USER.TOGGLE_NOTIFICATION}?isReceived=${isReceived}`,
  );
  return result.data;
};

export async function addEventOrOrgFavourite(payload: AddEventOrOrgFavouritePayload): Promise<BaseApiResponse<EventOrOrgFavouriteData>> {
  const res = await authService.post(`${END_POINT_LIST.USER.ADD_FAVORITE_EVENT}`, payload);
  return res.data;
}

export async function removeEventFavourite(eventId: string): Promise<BaseApiResponse<EventOrOrgFavouriteData>> {
  const res = await authService.delete(`${END_POINT_LIST.USER.REMOVE_FAV_EVENT}/${eventId}`);
  return res.data;
}

export async function removeOrgFavourite(orgId: string): Promise<BaseApiResponse<EventOrOrgFavouriteData>> {
  const res = await authService.delete(`${END_POINT_LIST.USER.REMOVE_FAV_ORG}/${orgId}`);
  return res.data;
}

export async function getUserFavouriteEvents(page: number = 1, limit: number = 10): Promise<BaseApiResponse<UserFavEvent[]>> {
  const res = await authService.get(`${END_POINT_LIST.USER.FAVORITE_EVENT}?page=${page}&limit=${limit}`);
  return res.data;
}

export async function getUsersByAdmin(params: UserAdminParams, accessToken: string): Promise<BaseApiResponse<UserAdminApiResponse>> {
  try {
    const cleanedEntries = Object.entries(params).filter(([_, value]) => value !== undefined);
    const cleanedParams = {
      ...Object.fromEntries(cleanedEntries),
      page: params.page,
      limit: params.limit
    } as UserAdminParams;

    const headers: { [key: string]: string } = {
      'Content-Type': 'application/json',
    };

    if (accessToken && accessToken !== "") {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const res = await authService.get(END_POINT_LIST.ADMIN.USERS, {
      params: cleanedParams,
      headers: headers,
    });

    if (!res) throw new Error('Failed to get users by admin');

    return res.data as BaseApiResponse<UserAdminApiResponse>;
  } catch (error: any) {
    console.error("Error get users by admin:", error?.response?.data?.message);
    throw new Error(`${error?.response?.data?.message}`);
  }
}

export async function updateUserStatus(email: string, newStatus: string, accessToken: string): Promise<BaseApiResponse<boolean>> {
  try {
    const headers: { [key: string]: string } = {
      'Content-Type': 'application/json',
    };

    if (accessToken && accessToken !== "") {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }
    const res = await authService.put(`${END_POINT_LIST.ADMIN.USERS}/${email}/status`, {
      status: newStatus
    }, {
      headers: headers
    });

    if (!res) throw new Error('Failed to update user status by admin')

    return res.data as BaseApiResponse<boolean>;
  } catch (error: any) {
    console.error("Error update user status by admin:", error?.response?.data?.message);
    throw new Error(`${error?.response?.data?.message}`);
  }
}

export async function updateUserRole(userId: string, newRole: number, accessToken: string): Promise<BaseApiResponse<boolean>> {
  try {
    const headers: { [key: string]: string } = {
      'Content-Type': 'application/json',
    };

    if (accessToken && accessToken !== "") {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }
    // Lưu ý: API yêu cầu truyền số, nên dùng mapping từ FE enum ra số
    const res = await authService.put(`${END_POINT_LIST.ADMIN.USERS}/${userId}/role`, {
      role: newRole
    }, {
      headers: headers
    });

    if (!res) throw new Error('Failed to update user role by admin');
    return res.data as BaseApiResponse<boolean>;
  } catch (error: any) {
    console.error("Error update user role by admin:", error?.response?.data?.message);
    throw new Error(`${error?.response?.data?.message}`);
  }
}

export async function getUserById(id: string): Promise<BaseApiResponse<User>> {
  try {
    const res = await authService.get(`${END_POINT_LIST.USER.USER}/${id}`);

    if (!res) throw new Error('Failed to get user by id');

    return res.data as BaseApiResponse<User>;
  } catch (error: any) {
    console.error("Error get user by id:", error?.response?.data?.message);
    throw new Error(`${error?.response?.data?.message}`);
  }
}

export async function getCurrentUser(): Promise<UserInfo> {
  try {
    const res = await authService.get<UserInfoResponse>(`${END_POINT_LIST.USER.GET_USER_INFO}`);

    if (!res) throw new Error('Failed to get user by id');

    return res.data.data
  } catch (error: any) {
    console.error("Error get user:", error?.response?.data?.message);
    throw new Error(`${error?.response?.data?.message}`);
  }
}

export async function getAllAdmin(): Promise<string[]> {
  try {
    const res = await authService.get<BaseApiResponse<string[]>>(`${END_POINT_LIST.ADMIN.ALL_ADMINS}`);

    if (!res) throw new Error('Failed to get all admins');

    return res.data.data
  } catch (error: any) {
    console.error("Error get all admins:", error?.response?.data?.message);
    throw new Error(`${error?.response?.data?.message}`);
  }
}