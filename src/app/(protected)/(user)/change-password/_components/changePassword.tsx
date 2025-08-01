"use client";

/* Package System */
import 'tailwindcss/tailwind.css';
import { Icon } from '@iconify/react';
import { Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState, useRef, FormEvent, useEffect } from 'react';

/* Package Application */
import 'styles/admin/pages/ForgotPassword.css';
import { useAuth } from 'contexts/auth.context';
import { changePassword } from 'services/auth.service';

export const ChangePasswordForm = () => {
    const { logout } = useAuth();
    const router = useRouter();
    const [showPopup, setShowPopup] = useState(false);
    const formRef = useRef<HTMLFormElement>(null); // Add a form reference
    const [loading, setLoading] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [errorOld, setErrorOld] = useState('');
    const [errorNew, setErrorNew] = useState('');
    const [errorConfirm, setErrorConfirm] = useState('');

    const t = useTranslations('common');

    const transWithFallback = (key: string, fallback: string) => {
        const msg = t(key);
        if (!msg || msg.startsWith('common.')) return fallback;
        return msg;
    };

    useEffect(() => {
        if (status === 'unauthenticated') {
            setShowPopup(true);
        }
    }, [status]);

    const handleClosePopup = () => {
        setShowPopup(false);
        router.push('/login');
    };

    if (status === 'loading') {
        return <div className="text-center mt-10">Đang kiểm tra phiên đăng nhập...</div>;
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        setErrorOld('');
        setErrorNew('');
        setErrorConfirm('');
        setErrorMessage('');
        setSuccessMessage('');

        const formData = new FormData(e.currentTarget);
        const oldPassword = formData.get("oldPassword") as string;
        const newPassword = formData.get("newPassword") as string;
        const confirmPassword = formData.get("confirmPassword") as string;

        // Only check if passwords match
        let isValid = true;

        if (newPassword !== confirmPassword) {
            setErrorConfirm(transWithFallback('confirmPassMismatch', 'Mật khẩu xác nhận không khớp.'));
            isValid = false;
        }

        if (isValid) {
            try {
                const result = await changePassword({
                    oldPassword,
                    newPassword,
                    confirmPassword,
                });

                if (result.statusCode === 200) {
                    setSuccessMessage(transWithFallback('changePassSuccess', 'Đổi mật khẩu thành công!'));
                    setErrorMessage('');
                    setErrorOld('');

                    if (formRef.current) {
                        formRef.current.reset();
                    }

                    setIsLoggingOut(true);

                    setTimeout(async () => {
                        try {
                            await logout();
                        } catch (error) {
                            console.error("Error during logout:", error);
                        } finally {
                            setIsLoggingOut(false);
                        }
                    }, 1000);
                } else {
                    setErrorMessage(result.message);
                }
            } catch (error) {
                setErrorMessage(transWithFallback('changePassError', 'Đã xảy ra lỗi khi đổi mật khẩu. Vui lòng thử lại sau.'));
                console.error("Change password error:", error);
            }
        }

        setLoading(false);
    };

    return (
        <div className="forgot-password-page">
            <div className="flex flex-col md:flex-row min-h-screen" style={{
                background: "linear-gradient(180deg, #9EF5CF 0%, #2F9098 68%, #176B87 100%)"
            }}>
                {/* Left Pane */}
                <div className="md:w-7/12 flex flex-col justify-center items-center px-6 py-10 overflow-y-auto max-h-screen">
                    <div className="w-full max-w-md mb-12 mt-12">
                        <div className="flex flex-col items-center mb-8">
                            <Image
                                src="/images/logo.png"
                                alt="EveBox Logo"
                                width={60}
                                height={60}
                                className="mb-4"
                            />
                            <h3 className="text-xl font-bold text-center">{transWithFallback('changePassword', 'Đổi mật khẩu mới')}</h3>
                        </div>

                        {successMessage && (
                            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                                {successMessage}
                            </div>
                        )}

                        {errorMessage && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                                {errorMessage}
                            </div>
                        )}

                        <form className="space-y-6" onSubmit={handleSubmit} ref={formRef}>
                            <div>
                                <label htmlFor="oldPassword" className="block font-semibold mb-1">{transWithFallback('enterOldPass', 'Nhập mật khẩu cũ')}</label>
                                <div className="relative">
                                    <input
                                        name="oldPassword"
                                        type={showOld ? "text" : "password"}
                                        id="oldPassword"
                                        placeholder={transWithFallback('enterOldPass', 'Nhập mật khẩu cũ')}
                                        className={`w-full px-4 py-2 border ${errorOld ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    />
                                    <button type="button" onClick={() => setShowOld(!showOld)} className="absolute right-3 top-2">
                                        <Icon icon={showOld ? "ph:eye-light" : "ph:eye-closed-light"} width="20" color="#aaaaaa" />
                                    </button>
                                </div>
                                {errorOld && <p className="text-red-500 text-sm mt-1">{errorOld}</p>}
                            </div>

                            <div>
                                <label htmlFor="new-password" className="block font-semibold mb-1">{transWithFallback('enterNewPass', 'Nhập mật khẩu mới')}</label>
                                <div className="relative">
                                    <input
                                        name="newPassword"
                                        type={showNew ? "text" : "password"}
                                        id="newPassword"
                                        placeholder={transWithFallback('enterNewPass', 'Nhập mật khẩu mới')}
                                        className={`w-full px-4 py-2 border ${errorNew ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    />
                                    <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-2">
                                        <Icon icon={showNew ? "ph:eye-light" : "ph:eye-closed-light"} width="20" color="#aaaaaa" />
                                    </button>
                                </div>
                                {errorNew && <p className="text-red-500 text-sm mt-1">{errorNew}</p>}
                            </div>

                            <div>
                                <label htmlFor="confirm-password" className="block font-semibold mb-1">{transWithFallback('confirmNewPass', 'Xác nhận mật khẩu mới')}</label>
                                <div className="relative">
                                    <input
                                        name="confirmPassword"
                                        type={showConfirm ? "text" : "password"}
                                        id="confirmPassword"
                                        placeholder={transWithFallback('confirmNewPass', 'Xác nhận mật khẩu mới')}
                                        className={`w-full px-4 py-2 border ${errorConfirm ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    />
                                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-2">
                                        <Icon icon={showConfirm ? "ph:eye-light" : "ph:eye-closed-light"} width="20" color="#aaaaaa" />
                                    </button>
                                </div>
                                {errorConfirm && <p className="text-red-500 text-sm mt-1">{errorConfirm}</p>}
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-[#0C4762] hover:bg-[#0C4762]-400 text-white font-semibold py-2 rounded-md transition duration-200 mt-6"
                                disabled={loading}
                            >
                                {loading ? transWithFallback('loadingBtn', 'Đang xử lý...') : transWithFallback('titleChangePassBtn', 'Đổi mật khẩu')}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right Pane */}
                <div className="md:w-5/12 relative hidden md:block">
                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/background_login.png')" }}></div>
                    <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                </div>
            </div>

            {isLoggingOut && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded-lg shadow-lg text-center flex flex-col items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-3" />
                        <p className="text-gray-800 font-medium">{transWithFallback('isLogouting', 'Đang đăng xuất...')}</p>
                    </div>
                </div>
            )}

            <Dialog open={showPopup} className="custom-dialog">
                <DialogTitle>
                    <div className="dialog-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', fontSize: '1.25rem', width: '100%', }}>
                        {transWithFallback('notLogin', 'Bạn chưa đăng nhập')}
                        <IconButton className="close-button" style={{ position: 'absolute', right: 2, top: '40%', transform: 'translateY(-50%)' }}
                            onClick={handleClosePopup} aria-label="Close"
                        >
                            <Icon icon="ph:x" width="24px" />
                        </IconButton>
                    </div>
                </DialogTitle>
                <DialogContent>
                    <div className="dialog-content text-center">
                        <Icon icon="fluent:warning-24-filled" width="48px" color="#f87171" />
                        <h3 className="font-semibold mt-2">{transWithFallback('pleaseLoginContinue', 'Vui lòng đăng nhập để tiếp tục!')}</h3>
                    </div>
                </DialogContent>
                <DialogActions className="dialog-actions">
                    <div className="action-wrapper">
                        <Button onClick={handleClosePopup} className="action-button">
                            {transWithFallback('backLoginPage', 'Về trang Đăng nhập')}
                        </Button>
                    </div>
                </DialogActions>
            </Dialog>
        </div>
    );
};