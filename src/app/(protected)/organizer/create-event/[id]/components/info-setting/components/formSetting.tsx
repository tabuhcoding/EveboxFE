"use client";

/* Package System */
import { useState } from "react";
import { Mail, LayoutList, ToggleLeft, ToggleRight } from "lucide-react";
// import { LockKeyhole, Users, User } from "lucide-react";

/* Package Application */
// import RadioOption from "../../common/form/radioOption";

export default function FormSettingClient({ onNextStep, btnValidate3 }: { onNextStep: () => void, btnValidate3: string }) {
    const [eventName, setEventName] = useState("name-of-event");
    // const [eventScopeSelected, setEventScopeSelected] = useState("everyone");
    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
    const [isToggleOn, setIsToggleOn] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
        const value = e.target.value;
        if (field === "eventName") setEventName(value);
        if (field === "message") setMessage(value);

        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: false }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: { [key: string]: boolean } = {};

        if (!eventName.trim()) newErrors.eventName = true;

        setErrors(newErrors);

        // Nếu nút là "Save"
        if (btnValidate3 === "Save") {
            alert("Form hợp lệ!");
        }
        // Nếu nút là "Continue"
        else if (btnValidate3 === "Continue") {
            alert("Form hợp lệ! Chuyển sang bước tiếp theo...");
            onNextStep();
        }
    };


    return (
        <>
            <div className="flex justify-center w-full mb-6">
                <form className="w-full max-w-4xl mx-auto mb-6" onSubmit={handleSubmit} id="setting-form">
                    <div className="p-6 lg:p-8 rounded-lg shadow-sm w-full max-w-5xl mx-auto" style={{ backgroundColor: "rgba(158, 245, 207, 0.2)", border: "1.5px solid #9EF5CF" }}>
                        <p className="block text-base font-bold mb-2">
                            <span className="text-red-500">* </span> Link dẫn đến sự kiện
                        </p>

                        {/* Tùy chỉnh đường dẫn */}
                        <div className="flex flex-wrap -mx-3 mb-6">
                            <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                                <p className="block text-sm font-bold mb-2">
                                    <span className="text-red-500">* </span> Tùy chỉnh đường dẫn:
                                </p>
                            </div>

                            <div className="w-full md:w-3/4 px-3 mb-6 md:mb-0">
                                <div className="relative">
                                    <input
                                        className={`text-sm block w-full border rounded py-3 px-4 mb-1 focus:outline-black-400 
                                            ${errors.eventName ? "border-red-500" : "border-gray-400"}`}
                                        type="text"
                                        value={eventName}
                                        onChange={(e) => handleInputChange(e, "eventName")}
                                    />
                                    <p className="text-sm text-gray-400 pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                                        {eventName.length}/80
                                    </p>
                                </div>
                                {errors.eventName && <p className="text-red-500 text-sm mt-1">Vui lòng tùy chỉnh đường dẫn</p>}
                            </div>
                        </div>

                        <span className="text-sm"> Đường dẫn sự kiện của bạn là:  </span>
                        <a
                            href={`https://evebox.vn/${eventName}`}
                            className="text-blue-600 hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            https://evebox.vn/{eventName}
                        </a>
                    </div>

                    {/* Tạm ẩn */}
                    {/* <div className="p-6 lg:p-8 rounded-lg shadow-sm w-full max-w-5xl mx-auto mt-3" style={{ backgroundColor: "rgba(158, 245, 207, 0.2)", border: "1.5px solid #9EF5CF" }}>
                        <div className="relative flex items-center space-x-2">
                            <LockKeyhole size={20} />
                            <label className="text-base font-bold">
                                Quyền riêng tư sự kiện
                            </label>
                        </div>

                        <RadioOption
                            value="everyone"
                            selectedValue={eventScopeSelected}
                            onChange={setEventScopeSelected}
                            icon={<Users size={18} />}
                            title="Sự kiện mở cho mọi người"
                            description="Tất cả mọi người đều có thể đặt vé"
                        />

                        <RadioOption
                            value="gropu"
                            selectedValue={eventScopeSelected}
                            onChange={setEventScopeSelected}
                            icon={<User size={18} />}
                            title="Sự kiện dành riêng cho 1 nhóm"
                            description="Chỉ người có link truy cập mới đặt được vé"
                        />
                    </div> */}

                    <div className="p-6 lg:p-8 rounded-lg shadow-sm w-full max-w-5xl mx-auto mt-3" style={{ backgroundColor: "rgba(158, 245, 207, 0.2)", border: "1.5px solid #9EF5CF" }}>
                        <div className="relative flex items-center space-x-2">
                            <Mail size={20} />
                            <p className="text-base font-bold">
                                Tin nhắn xác nhận cho người tham gia
                            </p>
                        </div>
                        <span className="text-sm">
                            Tin nhắn xác nhận này sẽ được gửi đến cho người tham gia sau khi đặt vé thành công
                        </span>
                        <div className="relative mt-2">
                            <textarea
                                className={`w-full h-32 text-sm block appearance-none border py-3 px-4 pr-8 rounded leading-tight focus:outline-black-400 ${errors.infoOrg ? "border-red-500" : "border-gray-400"
                                    }`}
                                placeholder="Nhập tin nhắn xác nhận"
                                value={message}
                                onChange={(e) => handleInputChange(e, "message")}
                            />
                            <p className="text-sm text-gray-400 pointer-events-none absolute inset-y-0 right-0 flex items-end px-2 mb-3">
                                0/500
                            </p>
                        </div>
                    </div>

                    <div className="p-6 lg:p-8 rounded-lg shadow-sm w-full max-w-5xl mx-auto mt-3 mb-6" style={{ backgroundColor: "rgba(158, 245, 207, 0.2)", border: "1.5px solid #9EF5CF" }}>
                        <div className="relative flex items-center space-x-2">
                            <LayoutList size={20} />
                            <p className="text-base font-bold">
                                Tạo bảng câu hỏi cho người tham gia
                            </p>
                        </div>

                        <span className="text-sm mt-3">
                            Evebox giúp bạn tạo câu hỏi với 3 mẫu: <br></br>
                            <span className="ml-3">1. Điền câu trả lời </span><br></br>
                            <span className="ml-3">2. Chọn 1 câu trả lời</span> <br></br>
                            <span className="ml-3">3. Chọn nhiều câu trả lời</span>
                        </span>

                        <div className="relative flex items-center space-x-2 ">
                            {isToggleOn ? <ToggleRight size={30} onClick={() => setIsToggleOn(false)} className="cursor-pointer text-[#51DACF]" /> : <ToggleLeft size={30} onClick={() => setIsToggleOn(true)} className="cursor-pointer text-gray-500" />}
                            <p className="text-sm cursor-pointer" onClick={() => setIsToggleOn(!isToggleOn)}>
                                Mở chức năng này (tạo câu hỏi ở bước sau)
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}