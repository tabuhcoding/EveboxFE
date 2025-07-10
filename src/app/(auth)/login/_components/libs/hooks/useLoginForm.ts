import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import * as Yup from 'yup';

export const useLoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      
      // Use NextAuth built-in Google provider
      const result = await signIn('google', {
        redirect: false,
        callbackUrl: '/',
      });

      if (result?.error) {
        setError('Đăng nhập Google thất bại');
      } else if (result?.ok) {
        router.push('/');
      }
    } catch (err) {
      setError(`Đã xảy ra lỗi khi đăng nhập với Google: ${err}.`);
    } finally {
      setIsLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Email không hợp lệ").required("Yêu cầu nhập email"),
      password: Yup.string().required("Yêu cầu nhập mật khẩu"),
    }),
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        const res = await signIn("credentials", {
          redirect: false,
          email: values.email,
          password: values.password,
        });

        if (res?.status === 200) {
          router.push('/');
        } else if (res?.status === 401) {
          setError('Email không tồn tại hoặc mật khẩu không chính xác!');
        } else {
          setError('Đăng nhập thất bại: ' + res?.error);
        }
      } catch  {
        setError("Đăng nhập thất bại, vui lòng thử lại.");
      } finally {
        setIsLoading(false);
      }
    },
  });

  return {
    showPassword,
    setShowPassword,
    error,
    setError,
    isLoading,
    handleGoogleLogin,
    formik,
  };
};
