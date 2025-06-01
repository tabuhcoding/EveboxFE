'use client'

/* Package System */
import axios, { AxiosError } from 'axios';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import * as Yup from 'yup';

/* Package Application */
import { OtpConstants } from 'app/(auth)/verify-otp/_components/libs/constants/otpConstants';
import { useAuth } from 'contexts/auth.context';
import { register } from 'services/auth.service';
import { ErrorResponse } from 'types/ErrorResponse';

export const useRegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleGoogleLogin = () => {
      try {
        setIsLoading(true);
        const width = 500;
        const height = 600;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;
  
        const popup = window.open(
          `${process.env.NEXT_PUBLIC_API_URL}/api/user/google`,
          'Google Login',
          `width=${width},height=${height},left=${left},top=${top}`
        );
  
        window.addEventListener('message', (event) => {
          if (event.origin === process.env.NEXT_PUBLIC_API_URL) {
            const { type, error } = event.data;
  
            if (type === 'GOOGLE_LOGIN_SUCCESS') {
              router.push('/');
              popup?.close();
            } else if (type === 'GOOGLE_LOGIN_ERROR') {
              setError(error || 'Login failed');
              popup?.close();
            }
          }
        });
      } catch (err) {
        setError(`Đã xảy ra lỗi khi đăng nhập với Google: ${err}.`);
      } finally {
        setIsLoading(false);
      }
    };
  
    useEffect(() => {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const code = urlParams.get('code');
  
      if (code) {
        setIsLoading(true);
        axios
          .get(`${process.env.NEXT_PUBLIC_API_URL}/api/user/google/callback`, {
            params: { code },
            withCredentials: true,
          })
          .then((response) => {
            const { access_token, refresh_token } = response.data.data;
  
            if (access_token) {
              login(access_token, refresh_token);
              localStorage.setItem('refresh_token', refresh_token);
              router.push('/');
            } else {
              setError('Không nhận được access token từ Google.');
            }
          })
          .catch(() => {
            setError('Đăng nhập Google thất bại');
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    }, [router]);

  const formik = useFormik({
    initialValues: {
      name: '',
      phone: '',
      email: '',
      password: '',
      re_password: '',
      role_id: 3,
      province_id: null,
      agree: false
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Yêu cầu nhập tên'),
      phone: Yup.string().min(10, 'Số điện thoại không hợp lệ').required('Yêu cầu nhập số điện thoại'),
      email: Yup.string().email('Email không hợp lệ').required('Yêu cầu nhập email'),
      password: Yup.string().min(6, 'Mật khẩu tối thiểu 6 ký tự').required('Yêu cầu nhập mật khẩu'),
      re_password: Yup.string()
        .oneOf([Yup.ref('password')], 'Mật khẩu không khớp')
        .required('Yêu cầu nhập lại mật khẩu'),
      agree: Yup.boolean().oneOf([true], 'Bạn phải đồng ý với các điều khoản'),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const result = await register(values);
        if (result.statusCode === 200) {
          setError('');
          localStorage.setItem('verifyData', JSON.stringify({
            ...values,
            request_token: result.data.request_token,
            remaining_attempts: result.data.remaining_attempts,
            resend_allowed_in: result.data.resend_allowed_in,
            type: OtpConstants.REGISTER,
          }));
          router.push('/verify-otp');
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const error = err as AxiosError<ErrorResponse>;
          setError(error.response?.data?.message || 'Đăng ký thất bại');
        } else {
          setError('Đăng ký thất bại');
        }
      } finally {
        setIsLoading(false);
      }
    },
  });

  return {
    showPassword,
    setShowPassword,
    showRePassword,
    setShowRePassword,
    error,
    isLoading,
    handleGoogleLogin,
    formik,
  };
};