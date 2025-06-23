"use client";

import { CalendarDate } from "@internationalized/date";
import { DateRangePicker } from "@nextui-org/react";
import { RangeValue } from "@react-types/shared";

import { DatePickerProps } from "types/models/dashboard/dashboard.interface";

export default function DatePicker({ value, onDateRangeChange }: DatePickerProps) {
  const handleChange = (newValue: RangeValue<CalendarDate> | null) => {
    onDateRangeChange(newValue);
  };

  return (
    <div className="relative h-[37px] w-full">
      <DateRangePicker
        value={value}
        onChange={handleChange}
        visibleMonths={2}
        radius="sm"
        classNames={{
          base: "w-full text-gray-800",
          selectorButton:
            "h-[30px] py-0 bg-white text-xs text-left flex items-center gap-2",
          selectorIcon:
            "text-gray-500 border-none outline-none shadow-none p-0 m-0 h-4 w-4",
          popoverContent: "bg-white rounded-lg shadow-lg p-2 z-50",
        }}
      />
    </div>
  );
}
