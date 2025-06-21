import React from "react";
import { InputFieldProps } from "../../../libs/interface/comform.interface";


export default function InputCountField ({
    label,
    placeholder,
    value,
    onChange,
    error = false,
    maxLength,
    required = false,
}: InputFieldProps) {
    return (
        <>
            <label className="block text-sm font-bold mb-2">
                {required && <span className="text-red-500">* </span>} {label}
            </label>
            <div className="relative">
                <input
                    className={`text-sm block w-full border rounded py-3 px-4 mb-1 focus:outline-black-400 ${
                        error ? "border-red-500" : "border-gray-400"
                    }`}
                    type="text"
                    placeholder={placeholder}
                    maxLength={maxLength}
                    value={value}
                    onChange={onChange}
                />
                <p className="text-sm text-gray-400 pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                    {value.length}/{maxLength}
                </p>
            </div>
            {error && <p className="text-red-500 text-sm mt-1">Vui lòng nhập {label.toLowerCase()}</p>}
        </>
    );
};