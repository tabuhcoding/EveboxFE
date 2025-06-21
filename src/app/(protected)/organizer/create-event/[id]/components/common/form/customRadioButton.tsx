import React from "react";
import { CustomRadioButtonProps } from "../../../libs/interface/comform.interface";

const CustomRadioButton: React.FC<CustomRadioButtonProps> = ({ value, selectedValue, onChange, label }) => {
    return (
        <label className="flex items-center gap-2 cursor-pointer mt-4">
            {/* Radio Input */}
            <input
                type="radio"
                name="text"
                className="peer hidden"
                value={value}
                checked={selectedValue === value}
                onChange={() => onChange(value)}
            />

            {/* Custom Radio Button */}
            <div className="w-4 h-4 rounded-full border border-black bg-white flex items-center justify-center peer-checked:bg-[#9EF5CF]">
                {selectedValue === value && <div className="w-2 h-2 rounded-full bg-white"></div>}
            </div>

            <span className="text-sm">{label}</span>
        </label>
    );
};

export default CustomRadioButton;
