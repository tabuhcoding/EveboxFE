"use client";

/* Package System */
import { useTranslations } from 'next-intl';
import { useState, useEffect } from "react";

/* Package Application */
import { getUserFavouriteEvents } from '@/services/auth.service';
import { UserFavEventResponse } from '@/types/models/dashboard/user.interface';
import AlertDialog from 'components/common/alertDialog';
import { useUserInfo } from 'lib/swr/useUserInfo';

import AvatarUpload from "./avatarUpload";
import useAvatar from "./libs/hooks/useAvatar";
import useProfile from "./libs/hooks/useProfile";
import MyFavoritePage from "./myFavoritePage";

export default  function ProfileForm() {
    const [activeTab, setActiveTab] = useState("info");
    const { updateProfile } = useProfile();
    const { userInfo, userInfoFetched, refetch } = useUserInfo();

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        avatar_id: 0
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [_dialogOpen, setDialogOpen] = useState(false);
    const [_dialogMessage, setDialogMessage] = useState("");

    useEffect(() => {
        if (userInfo && userInfoFetched) {
            setForm({
                name: userInfo.name || "",
                email: userInfo.email || "",
                phone: userInfo.phone || "",
                avatar_id: userInfo.avatar_id || 0
            });
        }
    }, [userInfo, userInfoFetched]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const result = await updateProfile({
                name: form.name,
                phone: form.phone,
                avatar_id: form.avatar_id
            });

            if (result.success) {
                setDialogMessage(transWithFallback('updateSuccess', 'Cập nhật thông tin thành công'));
                // SWR mutate để refresh data
                await refetch();
            } else {
                setDialogMessage(transWithFallback('updateFailed', 'Cập nhật thông tin thất bại'));
            }
            setDialogOpen(true);
        } catch {
            setDialogMessage(transWithFallback('updateError', 'Đã xảy ra lỗi khi cập nhật thông tin'));
            setDialogOpen(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleAvatarChange = (newAvatarId: number) => {
        setForm(prev => ({
            ...prev,
            avatar_id: newAvatarId
        }));
    };

    const imageUrl = useAvatar({ avatar_id: form.avatar_id })?.imageUrl || "/images/default_avt.png";

    // Handle favorite events
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); 
    const [userFavEvents, setUserFavEvents] = useState<UserFavEventResponse | null>(null);
    const [isLoadingFavEvents, setIsLoadingFavEvents] = useState(false);
    useEffect(() => {
        if (activeTab === "favorites") {
            loadFavoriteEvents(currentPage);
        }
    }, [activeTab, currentPage]);
    const loadFavoriteEvents = async (page: number) => {
        setIsLoadingFavEvents(true);
        try {
            const response = await getUserFavouriteEvents(page, itemsPerPage);
            setUserFavEvents(response);
        } catch (error) {
            console.error('Error loading favorite events:', error);
            setUserFavEvents(null);
        } finally {
            setIsLoadingFavEvents(false);
        }
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNext = () => {
        const totalPages = userFavEvents?.pagination?.totalPages || 0;
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const t = useTranslations('common');

    const transWithFallback = (key: string, fallback: string) => {
        const msg = t(key);
        if (!msg || msg.startsWith('common.')) return fallback;
        return msg;
    };

    const tabs = [
        { key: "info", label: transWithFallback('personalInfo', 'Thông tin cá nhân') },
        { key: "favorites", label: transWithFallback('favoriteList', 'Danh sách yêu thích') },
    ];

    return (
        <>
            {/* Banner Header */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-700 p-6 text-white">
                <div className="max-w-4xl mx-auto flex items-center gap-6">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-white">
                        <img src={imageUrl} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <p className="text-sm">{transWithFallback('account', 'Tài khoản của')}</p>
                        <h1 className="text-2xl font-bold">{form.name}</h1>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="profile-favorite-tab border-b border-gray-200 bg-white shadow-sm">
                <div className="max-w-4xl mx-auto px-4 flex space-x-6">
                    {tabs.map((tab) => (
                        <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                            className={`py-3 border-b-2 transition-all duration-200 text-sm font-medium whitespace-nowrap ${activeTab === tab.key
                                ? "border-teal-400 text-teal-400"
                                : "border-transparent text-gray-400 hover:text-teal-400"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>
            {activeTab === "info" && (
                <div className="max-w-3xl mx-auto">
                    <AlertDialog
                        open={_dialogOpen}
                        onClose={() => setDialogOpen(false)}
                        message={_dialogMessage}
                    />
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold mt-8 mb-4">{transWithFallback('accountManagement', 'Quản lý thông tin tài khoản')}</h2>
                            <h5 className="text-sm text-gray-700">
                                {transWithFallback('updatePersonalInfo', 'Quản lý và cập nhật thông tin cá nhân cho tài khoản của bạn')}
                            </h5>
                        </div>
                        <AvatarUpload initAvatarId={form.avatar_id} onChange={handleAvatarChange} />
                    </div>

                    <hr className="my-6 border-gray-700" />

                    <form onSubmit={handleSubmit}>
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-gray-700 font-medium">{transWithFallback('fullName', 'Họ và tên')}</label>
                                <div className="relative">
                                    <input
                                        id="name"
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder={transWithFallback('namePlaceholder', 'Nhập họ và tên của bạn')}
                                        className="w-full border p-2 rounded-md mt-1 bg-gray-100 focus:bg-white"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-gray-700 font-medium">{transWithFallback('emailAddress', 'Địa chỉ Email')}</label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    disabled
                                    className="w-full border p-2 rounded-md mt-1 bg-gray-200 text-gray-500 cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-gray-700 font-medium">{transWithFallback('phone', 'Số điện thoại')}</label>
                                <div className="relative">
                                    <input
                                        id="phone"
                                        type="tel"
                                        name="phone"
                                        value={form.phone}
                                        onChange={handleChange}
                                        placeholder={transWithFallback('phonePlaceholder', 'Nhập số điện thoại của bạn')}
                                        className="w-full border p-2 rounded-md mt-1 bg-gray-100 focus:bg-white"
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-[#51DACF] text-[#0C4762] px-4 py-2 rounded-md mt-2 hover:bg-teal-300 transition disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Đang xử lý...' : transWithFallback('save', 'Lưu')}
                                </button>
                            </div>
                            <div className="h-16"></div>
                        </div>
                    </form>
                </div>
            )}

            {activeTab === "favorites" && (
                <MyFavoritePage
                    events={userFavEvents?.data || []}
                    currentPage={userFavEvents?.pagination?.page || 1}
                    itemsPerPage={userFavEvents?.pagination?.limit || itemsPerPage}
                    totalPages={userFavEvents?.pagination?.totalPages || 0}
                    totalItems={userFavEvents?.pagination?.totalItems || 0}
                    isLoading={isLoadingFavEvents}
                    onPrevious={handlePrevious}
                    onNext={handleNext}
                />
            )}
        </>
    );
}