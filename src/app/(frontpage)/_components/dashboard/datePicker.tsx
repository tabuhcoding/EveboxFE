"use client";

/* Package System */
import { CalendarDate } from "@internationalized/date";
import { DateRangePicker } from "@nextui-org/react";
import { RangeValue } from "@react-types/shared";
import { useState } from "react";

/* Package Application */
import { DatePickerProps } from "types/models/dashboard/dashboard.interface";

export default function DatePicker({ onDateRangeChange }: DatePickerProps) {
  const [value, setValue] = useState<RangeValue<CalendarDate> | null>(null);

  const handleChange = (newValue: RangeValue<CalendarDate> | null) => {
    setValue(newValue);
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
            "h-[30px] py-0 bg-white text-sm text-left flex items-center gap-2",
          selectorIcon:
            "text-gray-500 border-none outline-none shadow-none p-0 m-0 h-4 w-4",
          popoverContent: "bg-white rounded-lg shadow-lg p-2 z-50",
        }}
      />
    </div>
  );
}
