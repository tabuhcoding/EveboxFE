"use client";

/* Package System */
import { CalendarRange } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { useRef, useState } from "react";
import { useTranslations } from 'next-intl';

/* Package Application */
import { DateTimePickerProps } from "../../../libs/interface/comform.interface";

export default function DateTimePicker({
  label,
  selectedDate,
  setSelectedDate,
  popperPlacement = "bottom-start",
  required = false,
  validateDate,
}: DateTimePickerProps) {
  const datePickerRef = useRef<DatePicker | null>(null);
  const [error, setError] = useState<string>("");
  const t = useTranslations('common');

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    if (!msg || msg.startsWith('common.')) return fallback;
    return msg;
  };

  const handleChange = (date: Date | null) => {
    if (validateDate && !validateDate(date)) {
      setError(transWithFallback("invalidTime", "Thời gian không hợp lệ. Vui lòng chọn lại!"));
    } else {
      setError("");
      setSelectedDate(date);
    }
  };

  return (
    <>
      <label className="block text-sm font-bold mb-2">
        {required && <span className="text-red-500">* </span>} {label}
      </label>
      <div className="relative">
        <div className="relative">
          <input
            type="text"
            value={selectedDate ? format(selectedDate, "dd-MM-yyyy HH:mm") : ""}
            placeholder={transWithFallback("selectTime", "Chọn thời gian")}
            readOnly
            className="text-sm text-gray-900 border py-3 px-4 w-full rounded leading-tight focus:outline-black-400 cursor-pointer"
            onClick={() => datePickerRef.current?.setOpen(true)}
          />
          <CalendarRange
            size={20}
            className="absolute right-3 top-3.5 text-gray-400 cursor-pointer"
            onClick={() => datePickerRef.current?.setOpen(true)}
          />
        </div>

        <DatePicker
          selected={selectedDate}
          onChange={handleChange}
          showTimeSelect
          dateFormat="dd-MM-yyyy HH:mm"
          ref={datePickerRef}
          className="hidden"
          popperPlacement={popperPlacement}
        />

        {error && <p className="text-red-500 text-sm mt-1 ml-1">{error}</p>}
      </div>


    </>
  );
}
