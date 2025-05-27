/* Package System */
import axios, { AxiosError } from 'axios';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import * as Yup from 'yup';

/* Package Application */
import { OtpConstants } from 'app/(auth)/verify-otp/_components/libs/constants/otpConstants';
import { forgotPassword } from 'services/auth.service';
import { ErrorResponse } from 'types/errorResponse';

export const useForgotPasswordForm = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const t = useTranslations('common');

  const emailFormik = useFormik({
    initialValues: { email: '' },
    validationSchema: Yup.object({
      email: Yup.string()
        .required(t('requiredEmail'))
        .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, t('invalidEmail'))
    }),
    validateOnChange: true,
    validateOnBlur: true,
    validateOnMount: true,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const result = await forgotPassword(values.email);
        if (result.statusCode === 200) {
          setError('');
          localStorage.setItem('verifyData', JSON.stringify({
            ...values,
            request_token: result.data.request_token,
            remaining_attempts: result.data.remaining_attempts,
            resend_allowed_in: result.data.resend_allowed_in,
            type: OtpConstants.FORGOT_PASSWORD,
          }));
          router.push('/verify-otp');
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const error = err as AxiosError<ErrorResponse>;
          setError(error.response?.data?.message || t('sendOTPFail'));
        } else {
          setError(t('sendOTPFail'));
        }
      } finally {
        setIsLoading(false);
      }
    }
  });

  return {
    error,
    isLoading,
    emailFormik,
  };
};