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
import { useVerifyOTPForm } from './libs/hooks/useVerifyOtpForm';

export const VerifyOTPForm = () => {
  const t = useTranslations('common');

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
    <div className="verify-otp-page">
      <div className='row'>
        <div className={`col-md-5 d-flex align-items-center justify-content-center left-register-pane`}>
          <div className="text-center">
            <h2>{t('welcomeBack')}</h2>
            <p>{t('welcomeText')}</p>
            <Link href="/login">
              <button className="btn btn-light login-btn">{t('login')}</button>
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
                <h3><strong>{t('titleOTP')}</strong></h3>
                <br></br>
                <h4><strong>{t('requireOTP')}</strong></h4>
                <span className='verify-msg-1'>{t('sendMailOTP')}:</span>
                <span className='verify-msg-2'>{email !== '' ? email : ''}</span>
              </div>
              <form onSubmit={formik.handleSubmit}>
                <div className="otp-area d-flex flex-column align-items-center">
                  <label htmlFor="otp" className="form-label font-style text-center">{t('codeOTP')}</label>
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
                  <span style={{ fontSize: '12px', color: 'white' }}>{t('noteCheckEmail')}<br></br>{t('emailFolders')}</span>
                  <br></br>
                  <p style={{ color: 'white' }}>{t('notReceivedOTP')}
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
                      className={`resend-btn ml-1 fw-bold ${isResendAllowed ? '' : 'disabled'}`}
                      style={{ cursor: isResendAllowed ? 'pointer' : 'not-allowed' }}
                    >
                      {t('resendCode')}
                    </span>
                  </p>
                </div>
                <div className="otp-timer d-flex align-items-center justify-content-center">
                  <span>{formatTime(timeLeft)}</span>
                </div>
                <button type="submit" className="btn w-100 mb-3">
                  {isLoading ? <CircularProgress size={24} color="inherit" /> : t('verifyOTP')}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Dialog open={isOpen} className="custom-dialog">
        <DialogTitle>
          <div className="dialog-title">
            {isVerified ? t('registerSuccess') : t('registerFail')}
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
            <h3>{isVerified ? t('successTitle') : t('failTitle')}</h3>
            <br />
            <p className="subtext">{t('activateAccount')} {isVerified ? t('activeSucess') : t('failTitle').toLocaleLowerCase()}!</p>
          </div>
        </DialogContent>
        <DialogActions style={{ marginBottom: '30px' }} className='d-flex flex-column justify-content-center'>
          <Button
            onClick={handleCloseDialog}
            className="action-button"
          >
            {t('backLoginPage')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};