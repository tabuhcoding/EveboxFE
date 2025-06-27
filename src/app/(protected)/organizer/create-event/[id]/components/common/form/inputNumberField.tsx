import React from "react";
import { InputFieldProps } from "../../../libs/interface/comform.interface";

const InputNumberField: React.FC<InputFieldProps> = ({
    label,
    value,
    placeholder,
    error = false,
    required = false,
    onChange,
}) => {
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
                    type="number"
                    value={value}
                    placeholder={placeholder}
                    onChange={onChange}
                />
            </div>
            {error && <p className="text-red-500 text-sm mt-1">Vui lòng nhập {label.toLowerCase()}</p>}
        </>
    );
};

export default InputNumberField;
