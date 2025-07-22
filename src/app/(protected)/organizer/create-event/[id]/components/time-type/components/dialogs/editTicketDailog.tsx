'use client'

/* Package System */
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useTranslations } from 'next-intl';

/* Package Application */
import DateTimePicker from "../../../common/form/dateTimePicker";
import InputCountField from "../../../common/form/inputCountField";
import ImageUpload from "../../../common/form/imageUpload";
import InputNumberField from "../../../common/form/inputNumberField";
import { EditTypeTicketDailogProps } from "../../../../libs/interface/dialog.interface";
import { useEventImageUpload } from "../../../../libs/hooks/useEventImageUpload";

export default function EditTicketDailog({ open, onClose, startDateEvent, endDateEvent, ticket, updateTicket }: EditTypeTicketDailogProps) {
    const [startDate, setStartDate] = useState<Date | null>(ticket.startDate || null);
    const [endDate, setEndDate] = useState<Date | null>(ticket.endDate || null);
    const [dateErrors, setDateErrors] = useState<{ startDate?: string, endDate?: string }>({});
    const [imageTicket, setImageTicket] = useState<string | null>(ticket.image || null);
    const isRegisterPayment = typeof window !== 'undefined' && localStorage.getItem("isRegisterPayment") === "true";

    const t = useTranslations('common');

    const transWithFallback = (key: string, fallback: string) => {
        const msg = t(key);
        if (!msg || msg.startsWith('common.')) return fallback;
        return msg;
    };

    const validateStartDate = (date: Date | null) => {
        if (!date || !endDate) return true;
        if (date > endDate) {
            setDateErrors((prev) => ({ ...prev, startDate: transWithFallback("conditionStart", "Thời gian bắt đầu bán vé phải nhỏ hơn hạn cuối bán vé") }));
            return false;
        }
        setDateErrors((prev) => ({ ...prev, startDate: undefined }));
        return true;
    };

    const validateEndDate = (date: Date | null) => {
        console.log(startDateEvent);
                console.log(endDateEvent);
        if (!date || !startDate) return true;

        if (date < startDate) {
            setEndDate(null);
            setDateErrors((prev) => ({ ...prev, startDate: transWithFallback("conditionStart", "Thời gian bắt đầu bán vé phải trước hạn cuối bán vé") }));
            return false;
        }

        if (startDateEvent && date >= startDateEvent){
            setDateErrors((prev) => ({ ...prev, endDate: transWithFallback("conditionEnd", "Hạn cuối bán vé phải trước thời gian sự kiện bắt đầu") }));
            return false;
        }

        if (endDateEvent && date >= endDateEvent) {
            setDateErrors((prev) => ({ ...prev, endDate: transWithFallback("conditionStartEnd", "Hạn cuối bán vé phải trước thời gian sự kiện kết thúc") }));
            return false;
        }

        setDateErrors((prev) => ({ ...prev, endDate: undefined }));
        setDateErrors((prev) => ({ ...prev, startDate: undefined }));

        return true;
    };


    const [ticketData, setTicketData] = useState({
        id: ticket.id,
        name: ticket.name,
        price: ticket.price,
        quantity: ticket.quantity,
        min: ticket.min,
        max: ticket.max,
        info: ticket.information,
        image: ticket.image,
        isFree: isRegisterPayment ? true : ticket.free,
    });

    const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
    const [imageErrors, setImageErrors] = useState<{ [key: string]: string }>({});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
        setTicketData((prev) => ({ ...prev, [field]: e.target.value }));

        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: false }));
        }
    };

    const { uploadImage } = useEventImageUpload();

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: string) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.size > 1 * 1024 * 1024) {
            setImageErrors((prev) => ({ ...prev, [type]: transWithFallback("sizeImg", "Dung lượng ảnh phải nhỏ hơn hoặc bằng 1MB!") }));
            toast.error(transWithFallback("sizeImg", "Dung lượng ảnh phải nhỏ hơn hoặc bằng 1MB!"), { duration: 5000 });
            return;
        }

        try {
            const { imageUrl } = await uploadImage(file);
            setImageTicket(imageUrl);
            setImageErrors((prev) => ({ ...prev, [type]: "" }));
        } catch {
            toast.error(transWithFallback("errUploadImg", "Tải ảnh vé thất bại"));
        }
    };


    //Lưu vé
    const handleSaveTicket = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: { [key: string]: boolean } = {};

        if (!ticketData.name) newErrors.name = true;
        if (!ticketData.price && !ticketData.isFree) newErrors.price = true;

        const isStartValid = validateStartDate(startDate);
        const isEndValid = validateEndDate(endDate);

        setErrors(newErrors);

        //Nếu có error thì không được đóng form
        if (Object.keys(newErrors).length > 0 || !isStartValid || !isEndValid) return;

        updateTicket({
            id: ticketData.id,
            name: ticketData.name,
            price: ticketData.price,
            quantity: ticketData.quantity,
            min: ticketData.min,
            max: ticketData.max,
            startDate,
            endDate,
            setSelectedStartDate: setStartDate,
            setSelectedEndDate: setEndDate,
            information: ticketData.info,
            image: imageTicket,
            free: ticketData.isFree,
        });

        onClose();
    }

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
                <div className="text-white dialog-header px-6 py-2 pb-4  justify-center items-center flex relative" style={{ background: '#0C4762' }}>
                    <DialogTitle className="!m-0 !p-0 text-lg text-center font-bold">{transWithFallback('btnCreateTicket', 'Tạo loại vé mới')}</DialogTitle>
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
                                    label={transWithFallback("ticketName", "Tên vé")}
                                    placeholder={transWithFallback("ticketName", "Tên vé")}
                                    value={ticketData.name}
                                    onChange={(e) => handleInputChange(e, "name")}
                                    error={errors.name}
                                    maxLength={50}
                                    required
                                />
                            </div>
                        </div>


                        <div className="flex flex-wrap -mx-3 mb-6">
                            {/* Giá vé */}
                            <div className="w-full md:w-1/6 px-3 mb-6 md:mb-0">
                                <p className="block text-sm font-bold mb-2">
                                    <span className="text-red-500">* </span> {transWithFallback("ticketPrice", "Giá vé")}
                                </p>
                                <div className="relative">
                                    <input
                                        className={`w-full p-2 border rounded-md text-sm 
    ${(ticketData.isFree || isRegisterPayment) ? 'bg-red-100 text-red-500 border-red-500 cursor-not-allowed' : 'border-gray-300'}`}
                                        type="number"
                                        value={ticketData.isFree || isRegisterPayment ? 0 : ticketData.price}
                                        placeholder="0"
                                        onChange={(e) => {
                                            setTicketData((prev) => ({ ...prev, price: e.target.value }));
                                            if (errors.price) {
                                                setErrors((prev) => ({ ...prev, price: false }));
                                            }
                                        }}
                                        disabled={ticketData.isFree || isRegisterPayment}
                                    />
                                </div>
                                {errors.ticketPrice && <p className="text-red-500 text-sm mt-1">{transWithFallback('inputTicketPrice', 'Vui lòng nhập giá vé')}</p>}
                            </div>

                            {/* Vé miễn phí */}
                            <div className="w-full md:w-1/6 px-3 mb-6 md:mb-0 flex items-center">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="fee"
                                        className="peer hidden"
                                        checked={ticketData.isFree}
                                        onChange={() => {
                                            if (!isRegisterPayment) {
                                                setTicketData((prev) => ({ ...prev, isFree: !prev.isFree, price: "0" }));
                                            }
                                        }}
                                        disabled={isRegisterPayment}
                                    />
                                    <div className={`w-4 h-4 rounded-full border border-black flex items-center justify-center 
                                                    ${ticketData.isFree ? "bg-[#9EF5CF] border-green-700" : "bg-white "}`}>
                                        {ticketData.isFree && <div className="w-2 h-2 rounded-full bg-white"></div>}
                                    </div>
                                    <span className="text-center">{transWithFallback('free' , 'Miễn phí')}</span>
                                </label>
                            </div>


                            {/* Tổng só lượng vé */}
                            <div className="w-full md:w-1/6 px-3 mb-6 md:mb-0">
                                <InputNumberField
                                    label={transWithFallback("totalTicketsAmount", "Tổng số lượng vé")}
                                    value={ticketData.quantity}
                                    placeholder=""
                                    error={errors.quantity}
                                    required
                                    onChange={(e) => handleInputChange(e, "quantity")}
                                />
                            </div>

                            {/* Số vé tối thiểu của một đơn hàng */}
                            <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                                <InputNumberField
                                    label={transWithFallback("minOrder", "Số vé tối thiểu của một đơn hàng")}
                                    value={ticketData.min}
                                    placeholder=""
                                    error={errors.min}
                                    required
                                    onChange={(e) => handleInputChange(e, "min")}
                                />
                            </div>

                            {/* Số vé tối đa của một đơn hàng */}
                            <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                                <InputNumberField
                                    label={transWithFallback("maxOrder", "Số vé tối đa của một đơn hàng")}
                                    value={ticketData.max}
                                    placeholder=""
                                    error={errors.max}
                                    required
                                    onChange={(e) => handleInputChange(e, "max")}
                                />
                            </div>
                        </div>

                        <div className="flex flex-wrap -mx-3 mb-6">
                            {/* Thời gian bắt đầu */}
                            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <DateTimePicker
                                    label={transWithFallback("startTime", "Thời gian bắt đầu")}
                                    selectedDate={startDate}
                                    setSelectedDate={setStartDate}
                                    popperPlacement="bottom-end"
                                    validateDate={validateStartDate}
                                    required
                                />
                                {dateErrors.startDate && <p className="text-red-500 text-sm ml-1">{dateErrors.startDate}</p>}
                            </div>

                            {/* Thời gian kết thúc */}
                            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <DateTimePicker
                                    label={transWithFallback("endTime", "Thời gian kết thúc")}
                                    selectedDate={endDate}
                                    setSelectedDate={setEndDate}
                                    popperPlacement="bottom-start"
                                    validateDate={validateEndDate}
                                    required
                                />
                                {dateErrors.endDate && <p className="text-red-500 text-sm ml-1">{dateErrors.endDate}</p>}
                            </div>
                        </div>

                        <div className="flex flex-wrap -mx-3 mb-6">
                            <div className="w-3/4 px-3 flex flex-col h-full">
                                {/* Thông tin vé */}
                                <p className="block text-sm font-bold mb-2">
                                    {transWithFallback("ticketInfo", "Thông tin vé")}
                                </p>
                                <div className="relative">
                                    <textarea
                                        className="w-full h-32 text-sm block appearance-none border py-3 px-4 pr-8 rounded leading-tight focus:outline-black-400"
                                        placeholder={transWithFallback("desciption", "Mô tả")}
                                        value={ticketData.info}
                                        onChange={(e) => handleInputChange(e, "info")}
                                    />
                                    <p className="text-sm text-gray-400 pointer-events-none absolute inset-y-0 right-0 flex items-end px-2 mb-3">
                                        0/1000
                                    </p>
                                </div>
                            </div>

                            {/* Hình ảnh vé */}
                            <div className="w-1/4 px-3 flex flex-col h-full">
                                <p className="block text-sm font-bold mb-2">
                                    {transWithFallback("imgTicket", "Hình ảnh vé")}
                                </p>
                                <div className="h-full flex items-center justify-center">
                                    <ImageUpload
                                        image={imageTicket}
                                        onUpload={(e) => handleUpload(e, "imageTicket")}
                                        placeholderText={transWithFallback("add", "Thêm")}
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
                                {transWithFallback("save", "Lưu")}
                            </button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}