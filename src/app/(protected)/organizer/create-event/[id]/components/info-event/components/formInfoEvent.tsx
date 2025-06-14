"use client";

/* Package System */
import { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

/* Package Application */
import SelectField from "../../common/form/selectField";
import TextEditor from "./textEditor";
import { handleImageUpload } from "../../../libs/functions/imageUploadUtils";
import OrganizationInfoForm from "./organizationInfoForm";
import EventLocationInput from "./eventLocationInput";
import EventImageUpload from "./eventImageUpload";
import { GenerationProps } from "./descriptionWithAI";

interface Category {
    id: number;
    name: string;
}

interface Province {
    id: number;
    name: string;
    districts: { id: number; name: string }[];
}

interface FormInformationEventClientProps {
    onNextStep: (formData: FormData) => void;
    btnValidate: string;
}

interface EventType {
    id: number;
    name: string;
}

export default function FormInformationEventClient({ onNextStep, btnValidate }: FormInformationEventClientProps) {
    const router = useRouter();
    const params = useParams();
    const currentEventId = params?.id;

    const { data: session } = useSession();

    const [background, setBackground] = useState<string | null>(null);
    const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
    const [logoOrg, setLogoOrg] = useState<string | null>(null);
    const [logoOrgFile, setLogoOrgFile] = useState<File | null>(null);

    const [eventName, setEventName] = useState("");
    const [nameOrg, setNameOrg] = useState("");
    const [infoOrg, setInfoOrg] = useState("");
    const [eventTypeSelected, setEventTypeSelected] = useState("offline");
    const [eventAddress, setEventAddress] = useState("");
    const [province, setProvince] = useState("");
    const [district, setDistrict] = useState("");
    const [ward, setWard] = useState("");
    const [street, setStreet] = useState("");

    //********Call api**********
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [allProvinces, setAllProvinces] = useState<Province[]>([]);
    const [generationForm, setGenerationForm] = useState<GenerationProps>({
        name: "",
        description: "",
        isOnlineEvent: eventTypeSelected === "offline" ? false : true,
        location: "",
        venue: "",
        organizer: "",
        organizerDescription: "",
        categoryIds: [],
    });

    //Gán cứng địa điểm đã tạo
    const createdLocations = [
        {
            name: "Nhà hát Ánh Trăng",
            eventAddress: "Nhà hát Ánh Trăng",
            province: "Ho Chi Minh City",
            districtName: "1 District", 
            ward: "Phường 6",
            street: "123 Phổ Quang",
        },
        {
            name: "Nhà văn hóa Thanh Niên",
            eventAddress: "Nhà văn hóa Thanh Niên",
            province: "Ho Chi Minh City",
            districtName: "Binh Thanh District",
            ward: "Phường Bến Nghé",
            street: "4 Phạm Ngọc Thạch",
        },
    ];

    //Nội dung sẵn trong Thông tin sự kiện
    const [post, setPost]
        = useState(`<p><strong>Giới thiệu sự kiện:</strong></p>
                <p>
                    [Tóm tắt ngắn gọn về sự kiện: Nội dung chính, điểm đặc sắc nhất
                    và lý do khiến người tham gia không nên bỏ lỡ]
                </p>

                <p><strong>Chi tiết sự kiện:</strong></p>
                <ul className="list-disc ml-5">
                    <li>
                        <span><strong>Chương trình chính:</strong></span> [Liệt kê
                        những hoạt động nổi bật trong sự kiện: các phần trình diễn, khách mời
                        đặc biệt, lịch trình các tiết mục cụ thể nếu có.]
                    </li>
                    <li>
                        <span><strong>Khách mời:</strong></span> [Thông tin về các khách
                        mời đặc biệt, nghệ sĩ, diễn giả sẽ tham gia sự kiện.]
                    </li>
                    <li>
                        <span><strong>Đối tượng hướng tới:</strong></span> [Chỉ rõ 
                        tệp đối tượng mà chương trình chủ yếu đáp ứng nhu cầu]
                    </li>
                </ul>

                <p><strong>Điều khoản và điều kiện:</strong></p>
                <p>[TnC] sự kiện</p>
                <p>Lưu ý về điều khoản trẻ em</p>
                <p>Lưu ý về điều khoản VAT</p>`);

    const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
    const [imageErrors, setImageErrors] = useState<{ [key: string]: string }>({});
    const [imageLogoErrors, setImageLogoErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        const fetchEventTypes = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`);
                if (!res.ok) {
                    throw new Error("Failed to fetch event types");
                }

                const data = await res.json();
                const eventTypes = data.map((item: EventType) => ({
                    id: item.id,
                    name: item.name,
                }));
                setCategories(eventTypes);
            } catch (error) {
                console.error("Error fetching event types:", error);
                toast.error("Lỗi khi tải danh sách thể loại sự kiện!", { duration: 5000 });
            }
        }

        fetchEventTypes();
    }, []);

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/all-districts`);
                if (!res.ok) {
                    throw new Error("Failed to fetch provinces");
                }

                const data = await res.json();
                setAllProvinces(data);
            } catch (error) {
                console.error("Error fetching provinces:", error);
                toast.error("Lỗi khi tải danh sách tỉnh thành phố!", { duration: 5000 });
            }
        };

        fetchProvinces();
    }, []);

    useEffect(() => {
        if (currentEventId) {
            const fetchEventDetail = async () => {
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/event/detail?eventId=${currentEventId}`);
                    if (!res.ok) {
                        throw new Error("Failed to fetch event details");
                    }
                    const data = await res.json();
                    const eventData = data.data;

                    setEventName(eventData.title);
                    setPost(eventData.description);
                    setEventTypeSelected(eventData.isOnline ? "online" : "offline");
                    setNameOrg(eventData.orgName);
                    setInfoOrg(eventData.orgDescription);

                    if (eventTypeSelected === "offline" || eventTypeSelected === "Offline") {
                        setEventAddress(eventData.venue);
                        if (eventData.locations) {
                            setStreet(eventData.locations.street);
                            setWard(eventData.locations.ward);

                            if (eventData.locations.districts) {
                                setDistrict(eventData.locations.districts.name);
                                setProvince(eventData.locations.districts.province.name);
                            }
                        }
                    } else {
                        setEventAddress("");
                        setStreet("");
                        setWard("");
                        setDistrict("");
                        setProvince("");
                    }
                    if (eventData.Images_Events_imgPosterIdToImages) {
                        setBackground(eventData.Images_Events_imgPosterIdToImages.imageUrl);
                    }
                    if (eventData.Images_Events_imgLogoIdToImages) {
                        setLogoOrg(eventData.Images_Events_imgLogoIdToImages.imageUrl);
                    }
                    // Nếu có category, bạn có thể set selectedCategory theo thông tin từ BE
                    if (eventData.EventCategories && eventData.EventCategories.length > 0) {
                        const cat = eventData.EventCategories[0].Categories;
                        setSelectedCategory({ id: cat.id, name: cat.name });
                    }

                    setGenerationForm({
                        name: eventData.title || "",
                        description: eventData.description || "",
                        isOnlineEvent: eventData.isOnline ? true : false,
                        location: `${eventData.locations?.street || ''}, ${eventData.locations?.ward || ''}, ${eventData.locations?.districts?.name}, ${eventData.locations?.districts?.province?.name}`,
                        venue: eventData.venue || "",
                        organizer: eventData.orgName || "",
                        organizerDescription: eventData.orgDescription || "",
                        categoryIds: selectedCategory?.id ? [selectedCategory.id] : [],
                    });
                } catch (error) {
                    console.error("Error fetching event detail:", error);
                    toast.error("Lỗi khi tải thông tin sự kiện!", { duration: 5000 });
                }
            }

            fetchEventDetail();
        };
    }, [currentEventId]);

    useEffect(() => {
        updateGenerationForm("isOnlineEvent", eventTypeSelected === "offline" ? false : true);
        updateGenerationForm("description", post);
    }, []);

    const updateGenerationForm = (field: keyof GenerationProps, value: string | number | boolean | number[]) => {
        setGenerationForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleUpload = (event: React.ChangeEvent<HTMLInputElement>, type: string) => {
        handleImageUpload(event, type, setImageErrors, setBackground, setBackgroundFile);
    };

    const handleUploadLogo = (event: React.ChangeEvent<HTMLInputElement>, type: string) => {
        handleImageUpload(event, type, setImageLogoErrors, setLogoOrg, setLogoOrgFile);
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>, field: string) => {
        const value = e.target.value;

        if (field === "province") {
            setProvince(value);
            setDistrict("");
        }
        if (field === "district") setDistrict(value);
        if (field === "ward") setWard(value);
        if (field === "typeEvent") {
            const cat = categories.find((c) => c.name === value) || null;
            const genCat = categories.find((c) => c.name === value);
            setSelectedCategory(cat);
            updateGenerationForm("categoryIds", genCat ? [genCat.id] : []);
        }

        // Xóa lỗi nếu chọn lại giá trị
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: false }));
        }
    };

    const onChange = (content: string) => {
        setPost(content);
        updateGenerationForm("description", content);
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
        const value = e.target.value;
        if (field === "eventName") {
            setEventName(value);
            updateGenerationForm("name", value);
        }
        if (field === "eventAddress") {
            setEventAddress(value);
            updateGenerationForm("venue", value);
        }
        if (field === "street") {
            setStreet(value);
            const location = `${value}, ${ward}, ${province}, ${district}`;
            updateGenerationForm("location", location);
        }
        if (field === "nameOrg") {
            setNameOrg(value);
            updateGenerationForm("organizer", value);
        }
        if (field === "infoOrg") {
            setInfoOrg(value);
            updateGenerationForm("organizerDescription", value);
        }
        if (field === "ward") setWard(value);
        if (field === "logoOrg") setLogoOrg(value);
        // if (field === "logoOrgFile") setLogoOrgFile(value);
        if (field === "background") setBackground(value);
        // if (field === "backgroundFile") setBackgroundFile(value);

        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: false }));
        }
    };

    const handleUpdateEvent = async (formData: FormData) => {
        const accessToken = session?.user?.accessToken;
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/org/event/${currentEventId}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    // Không set Content-Type khi gửi FormData
                },
                body: formData,
            });

            if (!res.ok) {
                const errorData = await res.json();
                toast.error(errorData.message || "Có lỗi xảy ra khi cập nhật sự kiện. Vui lòng thử lại sau.");
                return;
            }

            toast.success("Cập nhật sự kiện thành công, chuyển sang bước tiếp theo!", { duration: 5000 });
            router.push(`/organizer/create-event/${currentEventId}?step=showing`);
        } catch (error) {
            console.error("Error updating event:", error);
            toast.error("Lỗi khi cập nhật sự kiện!", { duration: 5000 });
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: { [key: string]: boolean } = {};

        if (!selectedCategory) newErrors.typeEvent = true;
        if (!eventName.trim()) newErrors.eventName = true;
        if (!nameOrg.trim()) newErrors.nameOrg = true;
        if (!infoOrg.trim()) newErrors.infoOrg = true;

        if (!currentEventId) {
            if (!background || !backgroundFile) {
                setImageErrors((prev) => ({ ...prev, background: "Vui lòng tải lên ảnh nền sự kiện" }));
                toast.error("Vui lòng tải lên ảnh nền sự kiện!", { duration: 5000 });
            }
            if (!logoOrg || !logoOrgFile) {
                setImageLogoErrors((prev) => ({ ...prev, logoOrg: "Vui lòng tải lên logo ban tổ chức" }));
                toast.error("Vui lòng tải lên logo ban tổ chức!", { duration: 5000 });
            }
        }

        if (eventTypeSelected === "offline" || eventTypeSelected === "Offline") {
            if (!eventAddress.trim()) newErrors.eventAddress = true;
            if (!province) newErrors.province = true;
            if (!district) newErrors.district = true;
            if (!ward) newErrors.ward = true;
            if (!street.trim()) newErrors.street = true;

            if (!eventAddress.trim() || !province || !district || !ward || !street.trim()) {
                toast.error("Vui lòng nhập đầy đủ thông tin địa điểm sự kiện!", { duration: 5000 });
            }
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            // if (currentEventId) {
            //     toast.success("Thông tin sự kiện đã tồn tại, chuyển sang bước tiếp theo.");
            //     router.push(`/organizer/create-event/${currentEventId}?step=showing`);
            //     return;
            // }
            const formData = new FormData();
            formData.append("title", eventName);
            formData.append("description", post);
            formData.append("isOnline", (eventTypeSelected === "online" || eventTypeSelected === "Online") ? "true" : "false");
            formData.append("venue", eventAddress); // Nếu offline, dùng tên địa điểm
            formData.append("orgName", nameOrg);
            formData.append("orgDescription", infoOrg);
            // Ví dụ categoryIds (bổ sung dữ liệu thật nếu có)

            if (selectedCategory) {
                formData.append("categoryIds", JSON.stringify([selectedCategory.id]));
            }

            if (backgroundFile) {
                formData.append("imgPoster", backgroundFile);
            }
            if (logoOrgFile) {
                formData.append("imgLogo", logoOrgFile);
            }

            if (currentEventId) {
                if (eventTypeSelected === "offline" || eventTypeSelected === "Offline") {
                    formData.append("wardString", ward);
                    formData.append("streetString", street);
                    const selectedProvince = allProvinces.find((p) => p.name === province);
                    const selectedDistrict = selectedProvince?.districts.find((d) => d.name === district);
                    if (selectedDistrict) {
                        formData.append("districtId", selectedDistrict.id.toString());
                    } else {
                        formData.append("districtId", "");
                    }
                } else {
                    formData.append("wardString", "");
                    formData.append("streetString", "");
                    formData.append("districtId", "");
                }
                await handleUpdateEvent(formData);
            }
            else {
                if (eventTypeSelected === "offline" || eventTypeSelected === "Offline") {
                    formData.append("wardString", ward);
                    formData.append("streetString", street);
                    const selectedProvince = allProvinces.find((p) => p.name === province);
                    const selectedDistrict = selectedProvince?.districts.find((d) => d.name === district);
                    if (selectedDistrict) {
                        formData.append("districtId", selectedDistrict.id.toString());
                    } else {
                        formData.append("districtId", "");
                    }
                }

                if (btnValidate === "Save") {
                    toast.success("Form hợp lệ! Đã lưu thông tin sự kiện!", { duration: 5000 });
                    onNextStep(formData);
                    toast.success("Đã lưu thông tin sự kiện!", { duration: 5000 });
                } else if (btnValidate === "Continue") {
                    toast.success("Form hợp lệ! Sẽ chuyển sang bước tiếp theo!", { duration: 5000 });
                    onNextStep(formData);
                }
            }
        }
    };

    //Xét điều kiện cho button của AI
    const [isFormValid, setIsFormValid] = useState(false);
    useEffect(() => {
        const isOffline = eventTypeSelected === "offline" || eventTypeSelected === "Offline";
        const requiredFieldsFilled =
            eventName.trim() !== "" && nameOrg.trim() !== "" && infoOrg.trim() !== "" && post.trim() !== "" && selectedCategory !== null && background !== null && logoOrg !== null &&
            (!isOffline || (eventAddress.trim() !== "" && province.trim() !== "" && district.trim() !== "" && ward.trim() !== "" && street.trim() !== ""));
        setIsFormValid(requiredFieldsFilled);
    }, [
        eventName, nameOrg, infoOrg, post, selectedCategory, background, logoOrg, eventAddress, province, district, ward, street, eventTypeSelected
    ]);

    return (
        <>
            <Toaster position="top-center" />
            <div className="flex justify-center mb-6">
                <form className="w-full max-w-4xl mx-auto mb-6" onSubmit={handleSubmit} id="event-form">
                    <EventImageUpload
                        background={background}
                        handleUpload={handleUpload}
                        imageErrors={imageErrors}
                        eventName={eventName}
                        handleInputChange={handleInputChange}
                        errors={errors}
                    />

                    <EventLocationInput
                        eventTypeSelected={eventTypeSelected} eventAddress={eventAddress}
                        province={province} district={district} ward={ward} street={street}
                        errors={errors} provinces={allProvinces.map((p) => p.name)}
                        districts={
                            province
                                ? allProvinces.find((p) => p.name === province)?.districts.map((d) => d.name) || []
                                : []
                        }
                        createdLocations={createdLocations}
                        // wards={wards}
                        handleInputChange={handleInputChange}
                        handleSelectChange={handleSelectChange}
                        setEventTypeSelected={setEventTypeSelected}
                        updateGenerationForm={updateGenerationForm}
                    />

                    <div className="mt-3 p-6 lg:p-8 rounded-lg shadow-sm w-full max-w-5xl mx-auto" style={{ backgroundColor: "rgba(158, 245, 207, 0.2)", border: "1.5px solid #9EF5CF" }}>
                        {/* Thể loại sự kiện */}
                        <div className="flex flex-wrap -mx-3 mb-6">
                            <div className="w-full px-3">
                                <SelectField
                                    label="Thể loại sự kiện"
                                    options={categories.map((cat) => cat.name)}
                                    value={selectedCategory ? selectedCategory.name : ""}
                                    onChange={(e) => handleSelectChange(e, "typeEvent")}
                                    error={errors.typeEvent}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-3 p-6 lg:p-8 rounded-lg shadow-sm w-full max-w-5xl mx-auto" style={{ backgroundColor: "rgba(158, 245, 207, 0.2)", border: "1.5px solid #9EF5CF" }}>
                        {/* Thông tin sự kiện */}
                        <div className="flex flex-wrap -mx-3 mb-6">
                            <div className="w-full px-3">
                                <label className="block text-sm font-bold mb-2">
                                    <span className="text-red-500">* </span> Thông tin sự kiện
                                </label>

                                <div className="boder ">
                                    <TextEditor generationForm={generationForm} content={post} onChange={onChange} isValidDescription={isFormValid} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <OrganizationInfoForm
                        logoOrg={logoOrg}
                        nameOrg={nameOrg}
                        infoOrg={infoOrg}
                        handleUpload={handleUploadLogo}
                        handleInputChange={handleInputChange}
                        errors={errors}
                        imageLogoErrors={imageLogoErrors}
                    />
                </form>
            </div>
        </>
    );
}
