/* Package System */
import axios, { AxiosError } from 'axios';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import * as Yup from 'yup';

/* Package Application */
import { ErrorResponse } from 'types/errorResponse';

export const useResetPasswordForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [error, setError] = useState('');
  const [resetToken, setResetToken] = useState<string | null>(null);
  const router = useRouter();
  const t = useTranslations('common');

  useEffect(() => {
    const token = sessionStorage.getItem('reset_token');
    if (token) {
      setResetToken(token);
    } else {
      setError(t('notRequestResetPass'));
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      password: '',
      re_password: '',
    },
    validationSchema: Yup.object({
      password: Yup.string().min(6, t('requireDigitPass')).required(t('requireEnterPass')),
      re_password: Yup.string()
        .oneOf([Yup.ref('password')], t('passwordMismatch'))
        .required(t('requireReEnterPass')),
    }),
    onSubmit: async (values) => {
      if (!resetToken) {
        setError(t('notRequestResetPass'));
        return;
      }

      try {
        const result = await axios.post('/api/user/reset-password', {
          newPassword: values.password,
          confirmPassword: values.re_password,
          resetToken
        });

        if (result.status === 200) {
          router.push('/login');
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const error = err as AxiosError<ErrorResponse>;
          setError(error.response?.data?.message || t('resetPassFailed'));
        } else {
          setError(t('resetPassFailed'));
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