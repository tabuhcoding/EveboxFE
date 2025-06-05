"use client";

import { Icon } from '@iconify/react';
import { IconButton, CircularProgress } from '@mui/material';
import Image from 'next/image'
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslations } from 'next-intl';

import { useRegisterForm } from './libs/hooks/useRegisterForm';
import '../../../../styles/admin/pages/Register.css';

export const RegisterForm = () => {
    const {
        showPassword,
        setShowPassword,
        showRePassword,
        setShowRePassword,
        error,
        isLoading,
        handleGoogleLogin,
        formik,
    } = useRegisterForm();

    const t = useTranslations('common');
    const transWithFallback = (key: string, fallback: string) => {
        const msg = t(key);
        if (!msg || msg.startsWith('common.')) return fallback;
        return msg;
    };

    return (
        <div>
            <div className="row min-h-[100vh] m-0">
                {/* Left pane */}
                <div className={`col-lg-5 col-md-12 d-flex align-items-center justify-content-center left-register-pane`}>
                    <div className="text-center">
                        <h2>{transWithFallback('welcomeBack', 'Chào mừng bạn quay lại!')}</h2>
                        <p>{transWithFallback('welcomeText', '')}</p>
                        <Link href="/login">
                            <button className="btn btn-light login-btn">{transWithFallback('login', 'Đăng nhập')}</button>
                        </Link>
                    </div>
                </div>

                {/* Right pane - Form content */}
                <div className="col-lg-7 col-md-12 d-flex align-items-center justify-content-center right-register-pane">
                    <div className="w-75">
                        <div className="register-form">
                            <Link href="/login" className="mobile-back-link mb-3">
                                &lt; {transWithFallback('login', 'Đăng nhập')}
                            </Link>
                            <div className="register-container d-flex flex-column align-items-center">
                                <Image
                                    src="/images/logo.png"
                                    alt="EveBox Logo"
                                    width={50}
                                    height={50} 
                                    className="mb-3 img-fluid logo"
                                />
                                <h3><strong>{transWithFallback('registerWith', 'Đăng ký ngay với') + ' Evebox'}</strong></h3>
                            </div>
                            <form onSubmit={formik.handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label font-style">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        placeholder={transWithFallback('emailPlaceholder', 'Nhập email của bạn')}
                                        className={`form-control ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.email}
                                    />
                                    {formik.touched.email && formik.errors.email && (
                                        <div className="text-danger" style={{ fontSize: '12px' }}>
                                            {formik.errors.email}
                                        </div>
                                    )}
                                </div>

                                <div className="d-flex mb-3">
                                    <div className="me-2 w-50">
                                        <label htmlFor="name" className="form-label font-style">{t("name")|| "TÊN"}</label>
                                        <input
                                            type="text"
                                            id="name"
                                            placeholder={transWithFallback('namePlaceholder', 'Nhập tên của bạn')}
                                            className={`form-control ${formik.touched.name && formik.errors.name ? 'is-invalid' : ''}`}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.name}
                                        />
                                        {formik.touched.name && formik.errors.name && (
                                            <div className="text-danger" style={{ fontSize: '12px' }}>
                                                {formik.errors.name}
                                            </div>
                                        )}
                                    </div>
                                    <div className="w-50">
                                        <label htmlFor="phone" className="form-label font-style">{t("phoneNumber")|| "SỐ ĐIỆN THOẠI"}</label>
                                        <input
                                            type="text"
                                            id="phone"
                                            placeholder={transWithFallback('phonePlaceholder', 'Nhập số điện thoại của bạn')}
                                            className={`form-control ${formik.touched.phone && formik.errors.phone ? 'is-invalid' : ''}`}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.phone}
                                        />
                                        {formik.touched.phone && formik.errors.phone && (
                                            <div className="text-danger" style={{ fontSize: '12px' }}>
                                                {formik.errors.phone}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="d-flex mb-3">
                                    <div className="me-2 w-50">
                                        <label htmlFor="password" className="form-label font-style">{transWithFallback('password', 'MẬT KHẨU')}</label>
                                        <div className="position-relative">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                id="password"
                                                placeholder={transWithFallback('passwordPlaceholder', 'Nhập mật khẩu')}
                                                className={`form-control ${formik.touched.password && formik.errors.password ? 'is-invalid' : ''}`}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.password}
                                            />
                                                <IconButton
                                                    className="position-absolute eye-btn"
                                                    aria-label="Toggle password visibility"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    <Icon icon={showPassword ? "ph:eye-light" : "ph:eye-closed-light"} width="20px" color="#aaaaaa" />
                                                </IconButton>
                                        </div>
                                        {formik.touched.password && formik.errors.password && (
                                            <div className="text-danger" style={{ fontSize: '12px' }}>
                                                {formik.errors.password}
                                            </div>
                                        )}
                                    </div>
                                    <div className="w-50">
                                        <label htmlFor="re_password" className="form-label font-style text-nowrap">{transWithFallback('reEnterPw', 'NHẬP LẠI MẬT KHẨU')}</label>
                                        <div className="position-relative">
                                            <input
                                                type={showRePassword ? 'text' : 'password'}
                                                id="re_password"
                                                name='re_password'
                                                placeholder={transWithFallback('confirmPwPlaceholder', 'Nhập lại mật khẩu')}
                                                className={`form-control ${formik.touched.re_password && formik.errors.re_password ? 'is-invalid' : ''}`}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.re_password}
                                            />
                                                <IconButton
                                                    className="position-absolute eye-btn"
                                                    aria-label="Toggle password visibility"
                                                    onClick={() => setShowRePassword(!showRePassword)}
                                                >
                                                    <Icon icon={showRePassword ? "ph:eye-light" : "ph:eye-closed-light"} width="20px" color="#aaaaaa" />
                                                </IconButton>
                                        </div>
                                        {formik.touched.re_password && formik.errors.re_password && (
                                            <div className="text-danger" style={{ fontSize: '12px' }}>
                                                {formik.errors.re_password}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="form-check mb-3">
                                    <input
                                        type="checkbox"
                                        id="agree"
                                        className="form-check-input"
                                        {...formik.getFieldProps('agree')}
                                    />
                                    <label htmlFor="agree" className="form-check-label">
                                        {transWithFallback('agree', 'Tôi đồng ý với tất cả')} <a href="" style={{ color: 'white', cursor: 'pointer' }}>{" "+ transWithFallback('term', 'Các điều khoản')}</a> {" "+ transWithFallback('and', 'và')} <a href="" style={{ color: 'white', cursor: 'pointer' }}>{" "+ transWithFallback('policy', 'Chính sách bảo mật')}</a>
                                    </label>
                                    {formik.touched.agree && formik.errors.agree && (
                                        <div className="text-danger">{formik.errors.agree}</div>
                                    )}
                                </div>
                                {error && error !== '' && <div className="alert alert-danger error-msg text-center">{error}</div>}
                                <button type="submit" className="btn w-100 mb-3">
                                    {isLoading ? <CircularProgress size={24} color="inherit" /> : transWithFallback('register', 'Đăng ký')}
                                </button>
                                <div className="text-center">
                                    <p style={{ color: 'white' }}>{transWithFallback('or', 'Hoặc')}</p>
                                    <Link style={{ textDecoration: 'none' }} href="#">
                                        <button className="google-button" onClick={handleGoogleLogin} disabled={isLoading}>
                                            <Icon icon="flat-color-icons:google" width="20px" color="#fff" />
                                            {transWithFallback('signInWith', 'Đăng nhập với') + ' Google'}
                                        </button>
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};