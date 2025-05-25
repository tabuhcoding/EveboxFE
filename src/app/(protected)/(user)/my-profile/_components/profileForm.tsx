"use client";

/* Package System */
import { useState, useEffect } from "react";

/* Package Application */
import AvatarUpload from "./avatarUpload";
import useProfile from "./libs/hooks/useProfile";
//import AlertDialog from "@/app/(showing)/showing/components/alertDialog";
import { gatewayService } from "../../../../../services/instance.service";
//import Loading from "../loading";
import { OrganizerDetail } from "./libs/interface/favorite.interface";
import MyFavoritePage from "./myFavoritePage";

export default function ProfileForm() {
    const [activeTab, setActiveTab] = useState("info");
    const [currentPage, setCurrentPage] = useState(1);

    const { updateProfile } = useProfile();
    const [profile, setProfile] = useState(null);
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        avatar_id: 0
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const fetchProfile = async () => {
        try {
            setIsLoading(true);
            const response = await gatewayService.get("/api/user/me");
            setProfile(response.data.data);

            // Update form with profile data
            setForm({
                name: response.data.data?.name || "",
                email: response.data.data?.email || "",
                phone: response.data.data?.phone || "",
                avatar_id: response.data.data?.avatar_id || ""
            });
        } catch (err) {
            console.error("Profile fetch error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const result = await updateProfile({
                name: form.name,
                phone: form.phone
            });

            if (result.success) {
                setDialogMessage('Cập nhật thông tin thành công');
            } else {
                setDialogMessage('Cập nhật thông tin thất bại');
            }
            setDialogOpen(true);
        } catch (error) {
            setDialogMessage('Cập nhật thông tin thất bại');
            setDialogOpen(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    // if (isLoading) {
    //     return <><Loading /></>;
    // }

    //Call API truyền dữ liệu các sự kiện yêu thích vào -> truyền vào EventSlider giống ở trang Dashboard
    const events = {
        favoriteEvents: [],
    };

    //Call API truyền dữ liệu nhà tổ chức yêu thích
    const favoriteOrganizers: OrganizerDetail[] = [
        {
            id: 1,
            Images_Events_imgLogoIdToImages: {
                imageUrl: "https://images.tkbcdn.com/2/608/332/ts/ds/03/21/08/2aff26681043246ebef537f075e2f861.png",
            },
            orgName: "TechFest Vietnam",
            orgDescription: "<p>TechFest Vietnam là nơi quy tụ những startup hàng đầu Việt Nam và khu vực.</p>",
        },
        {
            id: 2,
            Images_Events_imgLogoIdToImages: {
                imageUrl: "https://images.tkbcdn.com/2/608/332/ts/ds/03/21/08/2aff26681043246ebef537f075e2f861.png",
            },
            orgName: "UX Lovers",
            orgDescription: "<p>UX Lovers là cộng đồng dành cho các nhà thiết kế đam mê trải nghiệm người dùng.</p>",
        }
    ];

    //Pagination
    const itemsPerPage = 10;

    const totalItems = favoriteOrganizers.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(startItem + itemsPerPage - 1, totalItems);

    const handlePrevious = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const paginatedData = favoriteOrganizers.slice(startItem - 1, endItem);

    const tabs = [
        { key: "info", label: "Thông tin cá nhân" },
        { key: "favorites", label: "Danh sách yêu thích" },
    ];

    return (
        <>
            {/* Banner Header */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-700 p-6 text-white">
                <div className="max-w-4xl mx-auto flex items-center gap-6">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-white">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/default-avatar.png" alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <p className="text-sm">Tài khoản của</p>
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
                    {/* <AlertDialog
                        open={dialogOpen}
                        onClose={() => setDialogOpen(false)}
                        message={dialogMessage}
                    /> */}
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold mt-8 mb-4">Quản lý thông tin tài khoản</h2>
                            <h5 className="text-sm text-gray-700">
                                Quản lý và cập nhật thông tin cá nhân cho tài khoản của bạn
                            </h5>
                        </div>
                        <AvatarUpload initAvatarId={form.avatar_id} />
                    </div>

                    <hr className="my-6 border-gray-700" />

                    <form onSubmit={handleSubmit}>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-gray-700 font-medium">Họ và tên</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="Nhập họ và tên của bạn"
                                        className="w-full border p-2 rounded-md mt-1 bg-gray-100 focus:bg-white"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium">Địa chỉ email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    disabled
                                    className="w-full border p-2 rounded-md mt-1 bg-gray-200 text-gray-500 cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium">Số điện thoại</label>
                                <div className="relative">
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={form.phone}
                                        onChange={handleChange}
                                        placeholder="Nhập số điện thoại của bạn"
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
                                    {isSubmitting ? 'Đang xử lý...' : 'Lưu'}
                                </button>
                            </div>
                            <div className="h-16"></div>
                        </div>
                    </form>
                </div>
            )}

            {activeTab === "favorites" && (
                <MyFavoritePage
                    events={events}
                    favoriteOrganizers={favoriteOrganizers}
                    paginatedData={paginatedData}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    onPrevious={handlePrevious}
                    onNext={handleNext}
                />
            )}
        </>
    );
}