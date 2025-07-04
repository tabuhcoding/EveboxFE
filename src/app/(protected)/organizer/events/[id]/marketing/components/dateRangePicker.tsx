// components/dateRangePicker.tsx
'use client';

import { Dispatch, SetStateAction } from "react";
import DatePicker from "react-datepicker";

interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  setStartDate: Dispatch<SetStateAction<Date | null>>;
  setEndDate: Dispatch<SetStateAction<Date | null>>;
  onConfirm: () => void;
}

export default function DateRangePicker({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  onConfirm,
}: DateRangePickerProps) {
  return (
    <div className="flex items-center gap-4">
      <DatePicker
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        selectsStart
        startDate={startDate}
        endDate={endDate}
        placeholderText="Từ ngày"
        className="border border-[#0C4762] rounded-md p-2 text-gray-700"
      />
      <DatePicker
        selected={endDate}
        onChange={(date) => setEndDate(date)}
        selectsEnd
        startDate={startDate}
        endDate={endDate}
        minDate={startDate || undefined} 
        placeholderText="Đến ngày"
        className="border border-[#0C4762] rounded-md p-2 text-gray-700"
      />
      <button
        className="bg-[#0C4762] text-white px-4 py-2 rounded-md hover:bg-[#083548] transition-colors duration-200"
        onClick={onConfirm}
      >
        Xác nhận
      </button>
    </div>
  );
}
