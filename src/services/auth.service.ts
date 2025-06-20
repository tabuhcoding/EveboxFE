/* Package Application */
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
  ChangePasswordResponse
}
  from "./interface/auth.interface";

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
