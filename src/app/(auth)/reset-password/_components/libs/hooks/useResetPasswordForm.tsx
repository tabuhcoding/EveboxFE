/* Package System */
import axios, { AxiosError } from 'axios';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import * as Yup from 'yup';

/* Package Application */
import { resetPassword } from 'services/auth.service';
import { ErrorResponse } from 'types/ErrorResponse';

export const useResetPasswordForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [error, setError] = useState('');
  const [resetToken, setResetToken] = useState<string | null>(null);
  const router = useRouter();
  const t = useTranslations('common');

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    if (!msg || msg.startsWith('common.')) return fallback;
    return msg;
  };


  useEffect(() => {
    const token = localStorage.getItem('reset_token');
    if (token) {
      setResetToken(token);
    } else {
      setError(transWithFallback('notRequestResetPass', 'Không tìm thấy mã yêu cầu thay đổi mật khẩu.'));
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      password: '',
      re_password: '',
    },
    validationSchema: Yup.object({
      password: Yup.string().min(6, transWithFallback('requireDigitPass', 'Mật khẩu tối thiểu 6 ký tự')).required(transWithFallback('requireEnterPass', 'Yêu cầu nhập mật khẩu')),
      re_password: Yup.string()
        .oneOf([Yup.ref('password')], transWithFallback('passwordMismatch', 'Mật khẩu không khớp'))
        .required(transWithFallback('requireReEnterPass', 'Yêu cầu nhập lại mật khẩu')),
    }),
    onSubmit: async (values) => {
      if (!resetToken) {
        setError(transWithFallback('notRequestResetPass', 'Không tìm thấy mã yêu cầu thay đổi mật khẩu.'));
        return;
      }

      try {
        const result = await resetPassword({
          newPassword: values.password,
          confirmPassword: values.re_password,
          resetToken
        });

        if (result.statusCode === 200) {
          router.push('/login');
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const error = err as AxiosError<ErrorResponse>;
          setError(error.response?.data?.message || transWithFallback('resetPassFailed', 'Đổi mật khẩu thất bại'));
        } else {
          setError(transWithFallback('resetPassFailed', 'Đổi mật khẩu thất bại'));
        }
      }
    },
  });

  return {
    showPassword,
    setShowPassword,
    showRePassword,
    setShowRePassword,
    error,
    formik,
  };
};