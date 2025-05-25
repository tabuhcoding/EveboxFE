/* Package System */
import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';

/* Package Application */
import { OtpConstants } from '../constants/otpConstants';
import { ErrorResponse } from 'types/errorResponse';
import { verifyOtp } from 'services/auth.service';

const TIMELEFT = 60;
const ATTEMPTS = 5;

export const useVerifyOTPForm = () => {
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [type, setType] = useState<string>(OtpConstants.REGISTER);
  const [isResendAllowed, setIsResendAllowed] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [cntAttempts, setCntAttempts] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [requestToken, setRequestToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const verifyData = JSON.parse(localStorage.getItem('verifyData') || '{}');
    if (!verifyData) {
      router.push('/register');
      return;
    }

    setEmail(verifyData.email);
    setType(verifyData.type);
    setTimeLeft(verifyData.resend_allowed_in ?? TIMELEFT);
    setAttempts(verifyData.remaining_attempts ?? ATTEMPTS);
    setRequestToken(verifyData.request_token);
  }, [router]);

  useEffect(() => {
    if (timeLeft === 0) {
      setIsResendAllowed(true);
    } else {
      setIsResendAllowed(false);
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const formatTime = (time: number) => {
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const formik = useFormik({
    initialValues: { otp: '' },
    validationSchema: Yup.object({
      otp: Yup.string().required('Yêu cầu nhập mã OTP'),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const result = await verifyOtp({
          email,
          otp: values.otp,
          request_token: requestToken,
          type,
        });
        
        if (result.statusCode === 200) {
          setIsVerified(true);
          setError('');
        }
        setIsOpen(true);
      } catch (err) {
        setIsLoading(false);
        if (axios.isAxiosError(err)) {
          const error = err as AxiosError<ErrorResponse>;
          setError(error.response?.data?.message || 'Xác thực thất bại');
        } else {
          setError('Xác thực thất bại');
        }
      } finally {
        setIsLoading(false);
      }
    },
  });

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>, index: number) {
    if (e.key === 'Backspace') {
      const newOtp = [...otp];
      if (!newOtp[index] && index > 0) {
        e.preventDefault();
        newOtp[index - 1] = '';
        setOtp(newOtp);
  
        const prevInput = (e.target as HTMLInputElement).previousSibling as HTMLInputElement | null;
        if (prevInput) prevInput.focus();
      }
    }
  } 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (isNaN(Number(e.target.value))) return;
    
    const newOtp = [...otp];
    newOtp[index] = e.target.value;
    setOtp(newOtp);
    formik.setFieldValue('otp', newOtp.join(''));
    
    if (e.target.value && e.target.nextElementSibling) {
      (e.target.nextElementSibling as HTMLElement).focus();
    }
  };

  const handleResendOtp = async () => {
    setError('');
    setCntAttempts(cntAttempts + 1);

    if (cntAttempts >= attempts) {
      setIsResendAllowed(false);
      return;
    }

    try {
      const result = await axios.post('/api/user/otps/resend-otp', {
        email,
        type,
        request_token: requestToken,
      });

      if (result.status === 200) {
        setTimeLeft(result.data.resend_allowed_in ?? TIMELEFT);
        setAttempts(result.data.remaining_attempts ?? ATTEMPTS);
        setError('');
      } else {
        setError(`Gửi mã OTP thất bại: ${result.data.message}`);
        alert(result.data.message);
      }
    } catch (err) {
      setError(`Gửi mã OTP thất bại, vui lòng thử lại sau: ${err}.`);
    }
  };

  // const handleResendOtp = async () => {
  //   setError('');
  //   setCntAttempts(cntAttempts + 1);

  //   if (cntAttempts >= attempts) {
  //     setIsResendAllowed(false);
  //     return;
  //   }

  //   const verifyData = JSON.parse(localStorage.getItem('verifyData') || '{}');
  //   const values = {
  //     name: verifyData.name,
  //     phone: verifyData.phone,
  //     email: verifyData.email,
  //     password: verifyData.password,
  //     re_password: verifyData.re_password,
  //     agree: verifyData.agree,
  //     role_id: verifyData.role_id,
  //     province_id: verifyData.province_id,
  //   }

  //   const result = await axios.post(`/api/user/register`, values);

  //   if (result.status === 200 || result.status === 201) {
  //     setTimeLeft(result.data.data.resend_allowed_in ?? TIMELEFT);
  //     setAttempts(result.data.data.remaining_attempts ?? ATTEMPTS);
  //     setError('');
  //   }
  //   else {
  //     setError(`Gửi mã OTP thất bại: ${result.data.message}`);
  //     alert(result.data.message);
  //   }
  // };

  const handleCloseDialog = () => {
    setIsOpen(false);
    if (type === OtpConstants.FORGOT_PASSWORD) {
      router.push('/reset-password');
    } else {
      router.push('/login');
    }
  };

  return {
    otp,
    error,
    email,
    timeLeft,
    isResendAllowed,
    isVerified,
    isOpen,
    isLoading,
    formatTime,
    handleKeyDown,
    handleChange,
    handleResendOtp,
    handleCloseDialog,
    formik,
  };
};