"use client";

/* Package System */
import { Icon } from '@iconify/react';
import { Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslations } from 'next-intl';

/* Package Application */
import 'styles/admin/pages/VerifyOTP.css'
import { OtpConstants } from './libs/constants/otpConstants';
import { useVerifyOTPForm } from './libs/hooks/useVerifyOtpForm';

export const VerifyOTPForm = () => {
  const t = useTranslations('common');

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    if (!msg || msg.startsWith('common.')) return fallback;
    return msg;
  };

  const {
    otp,
    error,
    email,
    timeLeft,
    isResendAllowed,
    isVerified,
    isOpen,
    isLoading,
    isResending,
    type,
    formatTime,
    handleKeyDown,
    handleChange,
    handleResendOtp,
    handleCloseDialog,
    formik,
  } = useVerifyOTPForm();

  return (
    <div className="verify-otp-page">
      <div className='w-screen h-screen flex flex-col md:flex-row'>
        {/* Mobile view */}
        <div className="d-block d-md-none text-center mt-3">
          <Link href="/login" className="mobile-back-link">
            &lt; {transWithFallback('backLogin', 'Quay lại Đăng nhập')}
          </Link>
        </div>

        {/* Desktop view */}
        <div className={`col-md-5 d-flex align-items-center justify-content-center left-register-pane`}>
          <div className="text-center d-none d-md-block">
            <h2>{transWithFallback('welcomeBack', 'Chào mừng bạn quay lại!')}</h2>
            <p>{transWithFallback('welcomeText', 'Để không bỏ lỡ sự kiện nào, hãy cho chúng tôi biết thông tin của bạn')}</p>
            <Link href="/login">
              <button className="btn btn-light login-btn">{transWithFallback('login', 'Đăng nhập')}</button>
            </Link>
          </div>
        </div>
        
        <div className="col-md-7 d-flex align-items-center justify-content-center right-register-pane">
          <div className="w-75 mb-12 mt-12">
            <div className='verify-form'>
              <div className="verify-container d-flex flex-column align-items-center">
                <Image
                  src="/images/logo.png"
                  alt="EveBox Logo"
                  width={50}
                  height={50}
                  className="logo"
                />
                <h3><strong>{transWithFallback('titleOTP', 'Xác thực OTP')}</strong></h3>
                <br></br>
                <h4><strong>{transWithFallback('requireOTP', 'Nhập mã OTP gồm 6 chữ số')}</strong></h4>
                <span className='verify-msg-1'>{transWithFallback('sendMailOTP', 'Chúng tôi đã gửi mã OTP đến email')}:</span>
                <span className='verify-msg-2'>{email !== '' ? email : ''}</span>
              </div>
              <form onSubmit={formik.handleSubmit}>
                <div className="otp-area d-flex flex-column align-items-center">
                  <label htmlFor="otp" className="form-label font-style text-center">{transWithFallback('codeOTP', 'Mã OTP')}</label>
                  <div className='otp-nums align-items-center'>
                    {otp.map((data, index) => (
                      <input
                        key={index}
                        type="text"
                        maxLength={1}
                        className="otp-input"
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        onChange={(e) => handleChange(e, index)}
                        value={data}
                      />
                    ))}
                  </div>
                  {formik.touched.otp && formik.errors.otp && (
                    <div className="text-danger" style={{ fontSize: '12px' }}>
                      {Array.isArray(formik.errors.otp) ? formik.errors.otp.join(', ') : formik.errors.otp}
                    </div>
                  )}
                </div>
                {error && error !== '' && <div className="alert alert-danger error-msg text-center">{error}</div>}
                <div className="text-center">
                  <span style={{ fontSize: '12px', color: 'white' }}>{transWithFallback('noteCheckEmail', 'Lưu ý: Bạn vui lòng kiểm tra tất cả các thư mục của email')}<br></br>{transWithFallback('emailFolders', '(Hộp thư đến, Quảng cáo, Thư rác,...)')}</span>
                  <br></br>
                  <p style={{ color: 'white' }}>{transWithFallback('notReceivedOTP', 'Bạn không nhận được mã OTP?')}
                    <span
                      role="button"
                      tabIndex={0}
                      aria-pressed="false"
                      onClick={handleResendOtp}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          handleResendOtp();
                        }
                      }}
                      title={!isResendAllowed ? transWithFallback('waitToResend', 'Vui lòng chờ để gửi lại') : ''}
                      className={`resend-btn ml-1 fw-bold ${isResendAllowed ? '' : 'disabled'}`}
                      style={{ cursor: isResendAllowed ? 'pointer' : 'not-allowed' }}
                    >
                      {isResending ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-1" role="status" />
                          {transWithFallback('resending', 'Đang gửi lại mã...')}
                        </>
                      ) : (
                        transWithFallback('resendCode', 'Gửi lại mã')
                      )}
                    </span>
                  </p>
                </div>
                <div className="otp-timer d-flex align-items-center justify-content-center">
                  <span>{formatTime(timeLeft)}</span>
                </div>
                <button type="submit" className="btn w-100 mb-3">
                  {isLoading ? <CircularProgress size={24} color="inherit" /> : transWithFallback('verifyOTP', 'Xác minh OTP')}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Dialog open={isOpen} className="custom-dialog">
        <DialogTitle>
          <div className="dialog-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', fontWeight: 'bold', fontSize: '1.25rem', width: '100%' }}>
            {type === OtpConstants.FORGOT_PASSWORD
              ? isVerified
                ? transWithFallback('verifySuccess', 'Xác thực thành công')
                : transWithFallback('verifyFail', 'Xác thực thất bại')
              : isVerified
                ? transWithFallback('registerSuccess', 'Đăng ký thành công')
                : transWithFallback('registerFail', 'Đăng ký thất bại')}
            <IconButton
              className="close-button" style={{ position: 'absolute', right: 2, top: '40%', transform: 'translateY(-50%)' }}
              onClick={handleCloseDialog}
              aria-label="Close"
            >
              <Icon icon="ph:x" width="24px" />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent>
          <div className="dialog-content">
            <Icon icon={isVerified ? 'ph:check-circle-fill' : 'fluent-color:error-circle-24'} width="48px" color="#22C55E" />
            <h3>{isVerified ? transWithFallback('successTitle', 'Thành công') : transWithFallback('failTitle', 'Thất bại')}</h3>
            <br />
            {type === OtpConstants.FORGOT_PASSWORD
              ? `${transWithFallback('verifyAccount', 'Xác thực')} ${isVerified
                ? transWithFallback('activeSucess', 'thành công')
                : transWithFallback('failTitle', 'Thất bại').toLowerCase()}!`
              : `${transWithFallback('activateAccount', 'Kích hoạt tài khoản')} ${isVerified
                ? transWithFallback('activeSucess', 'thành công')
                : transWithFallback('failTitle', 'Thất bại').toLowerCase()}!`}
          </div>
        </DialogContent>
        <DialogActions style={{ marginBottom: '30px' }} className='d-flex flex-column justify-content-center'>
          <Button
            onClick={handleCloseDialog}
            className="action-button"
          >
            {type === OtpConstants.FORGOT_PASSWORD
              ? transWithFallback('titleResetPass', 'Đặt lại mật khẩu')
              : transWithFallback('backLoginPage', 'Về trang Đăng nhập')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};