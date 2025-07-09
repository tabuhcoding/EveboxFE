import axios from 'axios';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useState , useEffect } from 'react';
import * as Yup from 'yup';

export const useLoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

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
          const { type, data , error } = event.data;
		  console.log("event.data: ", event.data);
          if (type === 'GOOGLE_LOGIN_SUCCESS') {
		  console.log("data.access_token: ", data.access_token);
            // Store tokens temporarily for Google login handling
            localStorage.setItem('google_access_token', data.access_token);
            localStorage.setItem('google_refresh_token', data.refresh_token);
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
  console.log("queryString: ", queryString);
	
    const urlParams = new URLSearchParams(queryString);
    const code = urlParams.get('code');
  console.log("code: ", code);
	
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
            // Store tokens temporarily for Google login handling
            localStorage.setItem('google_access_token', access_token);
            localStorage.setItem('google_refresh_token', refresh_token);
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
