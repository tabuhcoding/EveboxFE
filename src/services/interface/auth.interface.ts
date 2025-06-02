export interface ForgotPasswordResponse {
  request_token: string;
  remaining_attempts: number;
  resend_allowed_in: string;
}

export interface RegisterPayloadProps {
  name: string;
  phone: string;
  email: string;
  password: string;
  re_password: string;
  agree: boolean;
  role_id: number;
  province_id: number[] | null;
}

export interface RegisterResponse {
  request_token: string;
  remaining_attempts: number;
  resend_allowed_in: number;
}

export interface VerifyOtpPayloadProps {
  email: string;
  otp: string;
  request_token: string;
  type: string;
}

export interface VerifyOtpResponse {
  token: string;
}

export interface ResendOtpPayloadProps {
  email: string;
  type: string;
  request_token: string;
}

export interface ResendOtpResponse {
  resend_allowed_in: number;
  remaining_attempts: number;
  message?: string;
}

export interface ResetPasswordPayloadProps {
  newPassword: string;
  confirmPassword: string;
  resetToken: string;
}

export interface ResetPasswordResponse {
  statusCode: number;
  message?: string;
}

export interface ChangePasswordPayloadProps {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordResponse {
  statusCode: number;
  message: string;
}
