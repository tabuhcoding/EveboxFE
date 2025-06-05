"use client";

/* Package System */
import { Icon } from '@iconify/react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { IconButton } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

/* Package Application */
import 'styles/admin/pages/ForgotPassword.css'
import { useResetPasswordForm } from './libs/hooks/useResetPasswordForm';

export const ResetPasswordForm = () => {
    const t = useTranslations('common');

    const transWithFallback = (key: string, fallback: string) => {
        const msg = t(key);
        if (!msg || msg.startsWith('common.')) return fallback;
        return msg;
    };

    const {
        showPassword,
        setShowPassword,
        showRePassword,
        setShowRePassword,
        error,
        formik,
    } = useResetPasswordForm();

    return (
        <div className="reset-password-page">
            <div className="w-screen h-screen overflow-x-hidden flex">
                <div className="col-md-7 d-flex align-items-center justify-content-center left-pane">
                    <Link href="/login" className="back-link">&lt; {transWithFallback('backLogin', 'v')}</Link>
                    <div className="w-75 mb-12 mt-12">
                        <div className="form">
                            <div className="container d-flex flex-column align-items-center">
                                <Image
                                    src="/images/logo.png"
                                    alt="EveBox Logo"
                                    width={50}
                                    height={50}
                                    className="logo"
                                />
                                <h3 ><strong>{transWithFallback('titleResetPass', 'Đặt lại mật khẩu')}</strong></h3>
                                <p className="subheading">{transWithFallback('promptNewPass', 'Mật khẩu trước của bạn đã được thiết lập lại. Vui lòng đặt mật khẩu mới cho tài khoản của bạn!')}</p>
                            </div>
                            <form onSubmit={formik.handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label bold-label">{transWithFallback('enterNewPass', 'Nhập mật khẩu mới').toLocaleUpperCase()}</label>
                                    <div className="position-relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            id="pasword"
                                            className={`form-control ${formik.touched.password && formik.errors.password ? 'is-invalid' : ''}`}
                                            placeholder={transWithFallback('enterNewPass', 'Nhập mật khẩu mới')}
                                            onChange={(e) => {
                                                formik.setFieldValue('password', e.target.value);
                                                formik.setFieldTouched('password', true, false);
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
                                    {formik.touched.password && formik.errors.password && (
                                        <div className="invalid-feedback">{formik.errors.password}</div>
                                    )}
                                </div>
                                {error && <div className="alert alert-danger">{error}</div>}

                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label bold-label">{transWithFallback('enterAgainNewPass', 'Nhập lại mật khẩu mới').toLocaleUpperCase()}</label>
                                    <div className="position-relative">
                                        <input
                                            type={showRePassword ? 'text' : 'password'}
                                            id="re_password"
                                            className={`form-control ${formik.touched.re_password && formik.errors.re_password ? 'is-invalid' : ''}`}
                                            placeholder={transWithFallback('enterAgainNewPass', 'Nhập lại mật khẩu mới')}
                                            onChange={(e) => {
                                                formik.setFieldValue('re_password', e.target.value);
                                                formik.setFieldTouched('re_password', true, false);
                                            }}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.re_password}
                                        />
                                        <IconButton
                                            className='position-absolute eye-btn'
                                            aria-label="Toggle password visibility"
                                            onClick={() => setShowRePassword(!showRePassword)}
                                        >
                                            <Icon icon={showRePassword ? "ph:eye-light" : "ph:eye-closed-light"} width="20px" color="#aaaaaa" />
                                        </IconButton>
                                    </div>
                                    {formik.touched.re_password && formik.errors.re_password && (
                                        <div className="invalid-feedback">{formik.errors.re_password}</div>
                                    )}
                                </div>
                                {error && <div className="alert alert-danger">{error}</div>}

                                <button
                                    style={{ marginTop: '50px' }}
                                    type="submit"
                                    className="btn btn-primary w-100 mb-3"
                                    disabled={!formik.isValid || !formik.dirty}
                                >
                                    {transWithFallback('titleResetPass','Đặt lại mật khẩu')}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="col-md-5 p-0">
                    <div className="background">
                        <div className="overlay"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};