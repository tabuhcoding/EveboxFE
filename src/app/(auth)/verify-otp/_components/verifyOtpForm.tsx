"use client";

import { Icon } from '@iconify/react';
import { Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from '@mui/material';
import Link from 'next/link';
import { useVerifyOTPForm } from './libs/hooks/useVerifyOtpForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@/styles/admin/pages/VerifyOTP.css';
import Image from 'next/image';

export const VerifyOTPForm = () => {
  const {
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
  } = useVerifyOTPForm();

  return (
    <div className='container-fluid vh-100 p-0'>
      <div className='row h-100 m-0'>
        <div className={`col-md-5 d-flex align-items-center justify-content-center left-register-pane`}>
          <div className="text-center">
            <h2>Chào mừng bạn quay lại!</h2>
            <p>Để không bỏ lỡ sự kiện nào, hãy cho chúng tôi biết thông tin của bạn</p>
            <Link href="/login">
              <button className="btn btn-light login-btn">Đăng nhập</button>
            </Link>
          </div>
        </div>
        <div className="col-md-7 d-flex align-items-center justify-content-center right-register-pane">
          <div className="w-75">
            <div className='verify-form'>
              <div className="verify-container d-flex flex-column align-items-center">
                <Image
                  src="/images/logo.png"
                  alt="EveBox Logo"
                  width={50}
                  height={50}
                  className="logo"
                />
                <h3><strong>Xác thực OTP</strong></h3>
                <br></br>
                <h4><strong>Nhập mã OTP gồm 6 chữ số</strong></h4>
                <span className='verify-msg-1'>Chúng tôi đã gửi mã OTP đến email:</span>
                <span className='verify-msg-2'>{email !== '' ? email : ''}</span>
              </div>
              <form onSubmit={formik.handleSubmit}>
                <div className="otp-area d-flex flex-column align-items-center">
                  <label htmlFor="otp" className="form-label font-style text-center">Mã OTP</label>
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
                  <span style={{ fontSize: '12px', color: 'white' }}>Lưu ý: Bạn vui lòng kiểm tra tất cả các thư mục của email<br></br>(Hộp thư đến, Quảng cáo, Thư rác,...)</span>
                  <br></br>
                  <p style={{ color: 'white' }}>Bạn không nhận được mã OTP? <strong onClick={handleResendOtp} className={`resend-btn ${isResendAllowed ? '' : 'disabled'}`}>Gửi lại mã</strong></p>
                </div>
                <div className="otp-timer d-flex align-items-center justify-content-center">
                  <span>{formatTime(timeLeft)}</span>
                </div>
                <button type="submit" className="btn w-100 mb-3">
                  {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Xác minh OTP'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Dialog open={isOpen} className="custom-dialog">
        <DialogTitle>
          <div className="dialog-title">
            {isVerified ? 'Đăng ký thành công' : 'Đăng ký thất bại'}
            <IconButton
              className="close-button"
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
            <h3>{isVerified ? 'Thành công' : 'Thất bại'}</h3>
            <br />
            <p className="subtext">Kích hoạt tài khoản {isVerified ? 'thành công' : 'thất bại'}!</p>
          </div>
        </DialogContent>
        <DialogActions style={{ marginBottom: '30px' }} className='d-flex flex-column justify-content-center'>
          <Button
            onClick={handleCloseDialog}
            className="action-button"
          >
            Về trang Đăng nhập
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};