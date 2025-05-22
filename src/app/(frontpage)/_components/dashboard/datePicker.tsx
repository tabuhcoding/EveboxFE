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
    <div className="date-picker-container rounded-[4px] !bg-white">
      <DateRangePicker
        value={value}
        onChange={handleChange}
        visibleMonths={2}
        radius="sm"
      />
    </div>
  );
}