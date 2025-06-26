'use client'

/* Package System */
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { toast } from "react-hot-toast";

/* Package Application */
import DateTimePicker from "../../../common/form/dateTimePicker";
import InputCountField from "../../../common/form/inputCountField";
import ImageUpload from "../../../common/form/imageUpload";
import InputNumberField from "../../../common/form/inputNumberField";
import { CreateTypeTicketDailogProps } from "../../../../libs/interface/dialog.interface";
import { useEventImageUpload } from "../../../../libs/hooks/useEventImageUpload";

export default function CreateTypeTicketDailog({ open, onClose, startDate, endDate, addTicket }: CreateTypeTicketDailogProps) {
    const [ticketName, setTicketName] = useState("");
    const [ticketNum, setTicketNum] = useState("");
    const [ticketNumMin, setTicketNumMin] = useState("1");
    const [ticketNumMax, setTicketNumMax] = useState("10");
    const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
    const [infoTicket, setInfoTicket] = useState("");
    const [imageTicket, setImageTicket] = useState<string | null>(null);
    const [imageErrors, setImageErrors] = useState<{ [key: string]: string }>({});
    const isRegisterPayment = typeof window !== 'undefined' ? localStorage.getItem("isRegisterPayment") !== "true" : false;
     const [ticketPrice, setTicketPrice] = useState(isRegisterPayment?"0":"");
    const [isFree, setIsFree] = useState(isRegisterPayment);
    const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(new Date());
    const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(startDate);
    
    const [dateErrors, setDateErrors] = useState<{ selectedStartDate?: string, selectedEndDate?: string }>({});

    const validateStartDate = (date: Date | null) => {
        if (!date || !selectedEndDate) return true;
        if (date > selectedEndDate) {
            setDateErrors((prev) => ({ ...prev, selectedStartDate: "Thời gian bắt đầu bán vé phải nhỏ hơn hạn cuối bán vé" }));
            return false;
        }
        setDateErrors((prev) => ({ ...prev, selectedStartDate: undefined }));
        return true;
    };

    const validateEndDate = (date: Date | null) => {
        if (!date || !selectedStartDate) return true;

        if (date < selectedStartDate) {
            setDateErrors((prev) => ({ ...prev, selectedStartDate: "Thời gian bắt đầu bán vé phải nhỏ hơn hạn cuối bán vé" }));
            setDateErrors((prev) => ({ ...prev, selectedEndDate: "Hạn cuối bán vé phải lớn hơn thời gian hiện bắt đầu" }));
            return false;
        }

        if (startDate && endDate && date >= startDate && date >= endDate) {
            setDateErrors((prev) => ({ ...prev, selectedEndDate: "Hạn cuối bán vé phải trước thời gian sự kiện bắt đầu" }));
            return false;
        }

        setDateErrors((prev) => ({ ...prev, selectedStartDate: undefined }));
        setDateErrors((prev) => ({ ...prev, selectedEndDate: undefined }));

        return true;
    };


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
        const value = e.target.value;
        if (field === "ticketName") setTicketName(value);
        if (field === "ticketPrice") setTicketPrice(value);
        if (field === "ticketNum") setTicketNum(value);
        if (field === "ticketNumMin") setTicketNumMin(value);
        if (field === "ticketNumMax") setTicketNumMax(value);
        if (field === "infoOrg") setInfoTicket(value);
        if (field === "infoTicket") setInfoTicket(value);

        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: false }));
        }
    };

    const { uploadImage } = useEventImageUpload();

const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 1 * 1024 * 1024) {
        setImageErrors((prev) => ({ ...prev, [type]: "Dung lượng ảnh phải nhỏ hơn hoặc bằng 1MB" }));
        toast.error("Dung lượng ảnh phải nhỏ hơn hoặc bằng 1MB!", { duration: 5000 });
        return;
    }

    try {
        const { imageUrl } = await uploadImage(file);
        setImageErrors((prev) => ({ ...prev, [type]: "" }));
        setImageTicket(imageUrl);
    } catch {
        toast.error("Tải ảnh vé thất bại");
    }
};

    //Lưu vé
    const handleSaveTicket = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: { [key: string]: boolean } = {};

        if (!ticketName) newErrors.ticketName = true;
        if (!ticketPrice) newErrors.ticketPrice = true;

        setErrors(newErrors);

        //Nếu có error thì không được đóng form
        if (Object.keys(newErrors).length > 0) return;

        addTicket({
            id:"",
            name: ticketName,
            price: ticketPrice,
            quantity: ticketNum,
            min: ticketNumMin,
            max: ticketNumMax,
            startDate: selectedStartDate,
            endDate: selectedEndDate,
            setSelectedStartDate,
            setSelectedEndDate,
            information: infoTicket,
            image: imageTicket,
            free: isFree,
        });

        console.log("Freee:",isFree);
        onClose();
    }

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
                <div className="text-white dialog-header px-6 py-2 pb-4  justify-center items-center flex relative" style={{ background: '#0C4762' }}>
                    <DialogTitle className="!m-0 !p-0 text-lg text-center font-bold">Tạo loại vé mới</DialogTitle>
                    <button onClick={onClose} className="absolute right-2 top-2 px-1 py-1 close-btn">
                        <Icon icon="ic:baseline-close" width="20" height="20" />
                    </button>
                </div>

                <DialogContent sx={{ overflowY: "auto", maxHeight: "70vh" }}>
                    <div className="content mx-4">
                        {/* Tên vé */}
                        <div className="flex flex-wrap -mx-3 mb-6">
                            <div className="w-full px-3">
                                <InputCountField
                                    label="Tên vé"
                                    placeholder="Tên vé"
                                    value={ticketName}
                                    onChange={(e) => handleInputChange(e, "ticketName")}
                                    error={errors.ticketName}
                                    maxLength={50}
                                    required
                                />
                            </div>
                        </div>


                        <div className="flex flex-wrap -mx-3 mb-6">
                            {/* Giá vé */}
                            <div className="w-full md:w-1/6 px-3 mb-6 md:mb-0">
                                <p className="block text-sm font-bold mb-2">
                                    <span className="text-red-500">* </span> Giá vé
                                </p>
                                <div className="relative">
                                    <input
  type="number"
  className={`w-full p-2 border rounded-md text-sm 
    ${isFree ? 'bg-red-100 text-red-500 border-red-500 cursor-not-allowed' : 'border-gray-300'}`}
  value={isFree ? "0" : ticketPrice}
  placeholder="0"
  onChange={(e) => {
    setTicketPrice(e.target.value);
    if (errors.ticketPrice) {
      setErrors((prev) => ({ ...prev, ticketPrice: false }));
    }
  }}
  disabled={isFree}
/>
                                </div>
                                {!isFree && errors.ticketPrice && <p className="text-red-500 text-sm mt-1">Vui lòng nhập giá vé</p>}
                            </div>

                            {/* Vé miễn phí */}
                            <div className="w-full md:w-1/6 px-3 mb-6 md:mb-0 flex items-center">
                                <label className={`flex items-center gap-2 ${isRegisterPayment ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}>
                                    <input
  type="checkbox"
  name="fee"
  className="peer hidden"
  checked={isFree}
  onChange={() => {
    if (!isRegisterPayment) {
      const newValue = !isFree;
      setIsFree(newValue);
      setTicketPrice(newValue ? "0" : "");
    }
  }}
  disabled={isRegisterPayment}
/>
                                    <div className={`w-4 h-4 rounded-full border border-black flex items-center justify-center 
                                                    ${isFree ? "bg-[#9EF5CF] border-green-700" : "bg-white "}`}>
                                        {isFree && <div className="w-2 h-2 rounded-full bg-white"></div>}
                                    </div>
                                    <span className="text-center">Miễn phí</span>
                                </label>
                            </div>


                            {/* Tổng só lượng vé */}
                            <div className="w-full md:w-1/6 px-3 mb-6 md:mb-0">
                                <InputNumberField
                                    label="Tổng số lượng vé"
                                    value={ticketNum}
                                    placeholder="10"
                                    error={errors.ticketNum}
                                    onChange={(e) => handleInputChange(e, "ticketNum")}
                                />
                            </div>

                            {/* Số vé tối thiểu của một đơn hàng */}
                            <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                                <InputNumberField
                                    label="Số vé tối thiểu của một đơn hàng"
                                    value={ticketNumMin}
                                    placeholder=""
                                    error={errors.ticketNumMin}
                                    required
                                    onChange={(e) => handleInputChange(e, "ticketNumMin")}
                                />
                            </div>

                            {/* Số vé tối đa của một đơn hàng */}
                            <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                                <InputNumberField
                                    label="Số vé tối đa của một đơn hàng"
                                    value={ticketNumMax}
                                    placeholder=""
                                    error={errors.ticketNumMax}
                                    required
                                    onChange={(e) => handleInputChange(e, "ticketNumMax")}
                                />
                            </div>
                        </div>

                        <div className="flex flex-wrap -mx-3 mb-6">
                            {/* Thời gian bắt đầu */}
                            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <DateTimePicker
                                    label="Thời gian bắt đầu"
                                    selectedDate={selectedStartDate}
                                    setSelectedDate={setSelectedStartDate}
                                    popperPlacement="bottom-end"
                                    validateDate={validateStartDate}
                                    required
                                />
                                 {dateErrors.selectedStartDate && <p className="text-red-500 text-sm ml-1">{dateErrors.selectedStartDate}</p>}
                            </div>

                            {/* Thời gian kết thúc */}
                            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <DateTimePicker
                                    label="Thời gian kết thúc"
                                    selectedDate={selectedEndDate}
                                    setSelectedDate={setSelectedEndDate}
                                    popperPlacement="bottom-start"
                                    validateDate={validateEndDate}
                                    required
                                />
                                 {dateErrors.selectedEndDate && <p className="text-red-500 text-sm ml-1">{dateErrors.selectedEndDate}</p>}
                            </div>
                        </div>

                        <div className="flex flex-wrap -mx-3 mb-6">
                            <div className="w-3/4 px-3 flex flex-col h-full">
                                {/* Thông tin vé */}
                                <p className="block text-sm font-bold mb-2">
                                    Thông tin vé
                                </p>
                                <div className="relative">
                                    <textarea
                                        className="w-full h-32 text-sm block appearance-none border py-3 px-4 pr-8 rounded leading-tight focus:outline-black-400"
                                        placeholder="Mô tả"
                                        value={infoTicket}
                                        onChange={(e) => handleInputChange(e, "infoTicket")}
                                    />
                                    <p className="text-sm text-gray-400 pointer-events-none absolute inset-y-0 right-0 flex items-end px-2 mb-3">
                                        0/1000
                                    </p>
                                </div>
                            </div>

                            {/* Hình ảnh vé */}
                            <div className="w-1/4 px-3 flex flex-col h-full">
                                <p className="block text-sm font-bold mb-2">
                                    Hình ảnh vé
                                </p>
                                <div className="h-full flex items-center justify-center">
                                    <ImageUpload
                                        image={imageTicket}
                                        onUpload={(e) => handleUpload(e, "imageTicket")}
                                        placeholderText="Thêm"
                                        dimensions="1MB"
                                        height="h-32"
                                        error={imageErrors.imageTicket}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 mt-4 mb-4">
                            <button
                                onClick={handleSaveTicket}
                                className="w-full border-2 border-[#51DACF] text-[#0C4762] font-bold py-2 px-4 rounded bg-[#51DACF] hover:bg-[#0C4762] hover:border-[#0C4762] hover:text-white transition-all"
                            >
                                Lưu
                            </button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}