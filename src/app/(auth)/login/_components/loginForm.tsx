"use client";

/* Package System */
import { Icon } from '@iconify/react';
import { CircularProgress, IconButton } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

/* Package Application */
import { useLoginForm } from './libs/hooks/useLoginForm';
import '../../../../styles/admin/pages/Login.css';

export const LoginForm = () => {
  const {
    showPassword,
    setShowPassword,
    error,
    setError,
    isLoading,
    handleGoogleLogin,
    formik,
  } = useLoginForm();

  if (error) {
    if (error==="SERVER_DOWN") {
      throw new Error(error);
    }
  }

  const t = useTranslations('common');
  const transWithFallback = (key: string, fallback: string) => {
        const msg = t(key);
        if (!msg || msg.startsWith('common.')) return fallback;
        return msg;
    };

  return (
    <div>
      <div className="row min-h-[100vh]">
        <div className="col-lg-7 col-md-12 d-flex align-items-center justify-content-center left-pane">
          <div className="w-75">
            <div className="login-form">
              <div className="login-container d-flex flex-column align-items-center">
                <Image
                  src="/images/logo.png"
                  alt="EveBox Logo"
                  width={50}
                  height={50}
                  className="logo"
                />
                <h3 className='mt-3'><strong>
                  {transWithFallback('login', 'Đăng nhập Evebox')}
                  </strong></h3>
              </div>
              <form onSubmit={formik.handleSubmit}>
                <div className="mb-3 short-input">
                  <label htmlFor="email" className="form-label font-style">Email</label>
                  <input
                    type="email"
                    id="email"
                    name='email'
                    className={`form-control ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
                    placeholder={transWithFallback('emailPlaceholder', 'Nhập email của bạn')}
                    style={{ height: '46px' }}
                    onChange={(e) => {
                      if (error) setError('');
                      formik.handleChange(e);
                    }}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <div className="text-danger" style={{ fontSize: '12px' }}>
                      {formik.errors.email}
                    </div>
                  )}
                </div>
                <div className="mb-3 short-input">
                  <label htmlFor="password" className="form-label font-style">{transWithFallback('password', 'MẬT KHẨU')}</label>
                  <div className='position-relative'>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name='password'
                      className={`form-control pr-10 ${formik.touched.password && formik.errors.password ? 'is-invalid' : ''}`}
                      placeholder={transWithFallback('passwordPlaceholder', 'Nhập mật khẩu của bạn')}
                      style={{ height: '46px', paddingRight: '50px' }}
                      onChange={(e) => {
                        if (error) setError('');
                        formik.handleChange(e);
                      }}
                      onBlur={formik.handleBlur}
                      value={formik.values.password}
                    />
                    <IconButton
                      className='position-absolute eye-btn'
                      aria-label="Toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <Icon icon={showPassword ? "ph:eye-light" : "ph:eye-closed-light"} width="20px" color="#aaaaaa" />
                    </IconButton>
                  </div>
                  {/* Hiển thị thông báo lỗi  */}
                  {formik.touched.password && formik.errors.password && (
                    <div className="text-danger" style={{ fontSize: '12px' }}>
                      {formik.errors.password}
                    </div>
                  )}
                </div>
                <div className="d-flex justify-content-between align-items-center mb-3 short-input">
                  <div className="d-flex align-items-center">
                    <input
                      type="checkbox"
                      id="agree"
                      className="form-check-input me-2"
                      {...formik.getFieldProps('agree')}
                    />
                    <label htmlFor="agree" className="form-check-label m-0">
                      {transWithFallback('rememberCredentials', 'Ghi nhớ đăng nhập')}
                    </label>
                  </div>
                  <a href="/forgot-password" className="text-decoration-none font-forget">
                    {transWithFallback('forgotPassword', 'Quên mật khẩu')}
                  </a>
                </div>

                <div className="short-input">
                  {error && error !== '' && <div className="alert alert-danger error-msg text-center">{error}</div>}
                  <button type="submit" className="btn btn-login w-100" style={{ marginBottom: '20px', marginTop: '10px' }} >
                    {isLoading ? (
                      <CircularProgress size={24} />
                    ) : (
                        transWithFallback('login', 'Đăng nhập')
                    )}
                  </button>
                </div>
                <div className="text-center short-input">
                  <span style={{ color: 'white' }}>{t("noAccount") || "Bạn chưa có tài khoản?"}</span>
                  <Link href="/register" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>
                    {" "+ transWithFallback('registerNow', 'Đăng ký ngay')}
                  </Link>
                  <p style={{ color: 'white', marginBottom: '20px', marginTop: '5px' }}>{transWithFallback('or', 'Hoặc')}</p>
                  <Link style={{ textDecoration: 'none' }} href="#">
                    <button className="google-button" style={{ marginBottom: '20px' }} onClick={handleGoogleLogin} disabled={isLoading}>
                      <Icon icon="flat-color-icons:google" width="20px" color="#fff" />
                      {transWithFallback('signInWith', 'Đăng nhập với') + " Google"}
                    </button>
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="col-lg-5 col-md-12 backdground">
          <div className="overlay"></div>
        </div>
      </div>
    </div>
  );
};
