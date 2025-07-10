/* Package System */
import React from "react";
import { ChevronDown } from "lucide-react";
import { useTranslations } from 'next-intl';

/* Package Application */
import { SelectFieldProps } from "../../../libs/interface/comform.interface";

export default function SelectField({
  label,
  options,
  value,
  onChange,
  error = false,
  required = false,
}: SelectFieldProps) {
  const t = useTranslations('common');

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    if (!msg || msg.startsWith('common.')) return fallback;
    return msg;
  };

  return (
    <>
      <label className="block text-sm font-bold mb-2">
        {required && <span className="text-red-500">* </span>} {label}
      </label>
      <div className="relative">
        <select
          className={`text-sm block appearance-none w-full border py-3 px-4 pr-8 rounded leading-tight focus:outline-black-400 ${error ? "border-red-500" : "border-gray-400"
            } ${value === "" ? "text-gray-400" : "text-black"}`}
          value={value}
          onChange={onChange}
        >
          <option value="" disabled hidden>
            {transWithFallback('select', 'Chọn')} {label}
          </option>

          {options.map((item, index) => {
            const label = typeof item === "string" ? item : item.vi || item.en; // Fallback if only one exists
            const value = typeof item === "string" ? item : item.vi; // or `.id` if your data is like `{ id, name }`
            return (
              <option value={value} key={index} className="text-black">
                {label}
              </option>
            );
          })}
        </select>
        <div className="text-gray-400 pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
          <ChevronDown size={20} />
        </div>
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-1">
          {transWithFallback('pleaseSelect', 'Vui lòng chọn')} {label.toLowerCase()}
        </p>
      )}
    </>
  );
}
