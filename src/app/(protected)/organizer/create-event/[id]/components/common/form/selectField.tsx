import React from "react";
import { ChevronDown } from "lucide-react";
import { SelectFieldProps } from "../../../libs/interface/comform.interface";

export default function SelectField({
    label,
    options,
    value,
    onChange,
    error = false,
    required = false,
}: SelectFieldProps){
    return (
        <>
            <label className="block text-sm font-bold mb-2">
                {required && <span className="text-red-500">* </span>} {label}
            </label>
            <div className="relative">
                <select
                    className={`text-sm block appearance-none w-full border py-3 px-4 pr-8 rounded leading-tight focus:outline-black-400 ${
                        error ? "border-red-500" : "border-gray-400"
                    } ${value === "" ? "text-gray-400" : "text-black"}`}
                    value={value}
                    onChange={onChange}
                >
                    <option value="" disabled hidden>
                        Chọn {label}
                    </option>
                    {options.map((item, index) => (
                        <option value={item} key={index} className="text-black">
                            {item}
                        </option>
                    ))}
                </select>
                <div className="text-gray-400 pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                    <ChevronDown size={20} />
                </div>
            </div>
            {error && <p className="text-red-500 text-sm mt-1">Vui lòng chọn {label.toLowerCase()}</p>}
        </>
    );
};