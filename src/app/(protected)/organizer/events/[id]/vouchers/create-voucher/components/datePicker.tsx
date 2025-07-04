"use client";

import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DateRangePicker = () => {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  return (
    <div className="flex items-center gap-4">
      <DatePicker
        selected={startDate}
        onChange={(date) => setStartDate(date || undefined)}
        selectsStart
        startDate={startDate}
        endDate={endDate}
        placeholderText="Từ ngày"
        className="w-full p-2 border rounded border-gray-300 text-sm"
        enableTabLoop={false}
      />
      <DatePicker
        selected={endDate}
        onChange={(date) => setEndDate(date || undefined)}
        selectsEnd
        startDate={startDate}
        endDate={endDate}
        minDate={startDate}
        placeholderText="Đến ngày"
        className="w-full p-2 border rounded border-gray-300 text-sm"
        enableTabLoop={false}
      />
    </div>
  );
};

export default DateRangePicker;
