"use client";

import { toast } from "react-hot-toast";

export const validateStartDate = (date: Date | null, endDate: Date | null) => {
    return !date || !endDate || date <= endDate; // Thời gian bắt đầu không được lớn hơn thời gian kết thúc
};

export const validateEndDate = (date: Date | null, startDate: Date | null) => {
    return !date || !startDate || date >= startDate; // Thời gian kết thúc không được nhỏ hơn thời gian bắt đầu
};

export const validateTimeSelection = (
    startDate: Date | null, 
    endDate: Date | null,
    setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>
) => {
    if (!startDate || !endDate) {
        setErrors((prev) => ({
            ...prev,
            startDate: !startDate,
            endDate: !endDate,
        }));
        toast.error("Vui lòng chọn thời gian bắt đầu và kết thúc");
        return false;
    }
    return true;
};
