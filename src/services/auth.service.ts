import { authService } from "./instance.service";
import { END_POINT_LIST } from "./endpoint";
import { BaseApiResponse } from "types/baseApiResponse";

interface ForgotPasswordResponse {
  request_token: string;
  remaining_attempts: number;
  resend_allowed_in: string;
}

export const forgotPassword = async (email: string): Promise<BaseApiResponse<ForgotPasswordResponse>> => {
  const result = await authService.post<BaseApiResponse<ForgotPasswordResponse>>(END_POINT_LIST.USER.FORGOT_PASSWORD, { email });
  return result.data;
};

interface RegisterPayloadProps {
  name: string;
  phone: string;
  email: string;
  password: string;
  re_password: string;
  agree: boolean;
  role_id: number;
  province_id: number[] | null;
}

interface RegisterResponse {
  request_token: string;
  remaining_attempts: number;
  resend_allowed_in: number;
}

export const register = async (payload: RegisterPayloadProps): Promise<BaseApiResponse<RegisterResponse>> => {
  const result = await authService.post<BaseApiResponse<RegisterResponse>>(END_POINT_LIST.USER.REGISTER, payload);
  return result.data;
};
interface VerifyOtpPayloadProps {
  email: string;
  otp: string;
  request_token: string;
  type: string;
}

interface VerifyOtpResponse {
  token: string;
}

export const verifyOtp = async (payload: VerifyOtpPayloadProps): Promise<BaseApiResponse<VerifyOtpResponse>> => {
  const result = await authService.post<BaseApiResponse<VerifyOtpResponse>>(END_POINT_LIST.USER.VERIFY_OTP, payload);
  return result.data;
}