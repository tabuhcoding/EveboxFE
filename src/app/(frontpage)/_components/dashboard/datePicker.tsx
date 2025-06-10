"use client";

/* Package System */
import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date";
import { DateRangePicker } from "@nextui-org/react";
import { RangeValue } from "@react-types/shared";
import { useState } from "react";

/* Package Applicatio */
import { DatePickerProps } from "types/models/dashboard/dashboard.interface";

export default function DatePicker({ onDateRangeChange }: DatePickerProps) {
  const [value, setValue] = useState<RangeValue<CalendarDate> | null>({
    start: today(getLocalTimeZone()).subtract({ days: 1 }),
    end: today(getLocalTimeZone()),
  });

  const handleChange = (newValue: RangeValue<CalendarDate> | null) => {
    setValue(newValue);
    onDateRangeChange(newValue);
  };

  return (
    <div className="relative h-[37px]">
      <DateRangePicker
        value={value}
        onChange={handleChange}
        visibleMonths={2}
        radius="sm"
        classNames={{
          base: "w-full text-gray-800",
          selectorButton: "h-[30px] py-0 bg-white text-sm text-left flex items-center gap-2",
          selectorIcon: "text-gray-500 border-none outline-none shadow-none p-0 m-0 h-5 w-5",
          popoverContent: "bg-white rounded-lg shadow-lg p-2 z-50",
        }}
      />
    </div>
  );
}