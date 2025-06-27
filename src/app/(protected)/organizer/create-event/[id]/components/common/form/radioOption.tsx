"use client";

import React from "react";
import { RadioOptionProps } from "../../../libs/interface/comform.interface";

const RadioOption: React.FC<RadioOptionProps> = ({ value, selectedValue, onChange, icon, title, description }) => {
    return (
        <label className="flex items-center gap-2 cursor-pointer mt-2">
            {/* Radio Input */}
            <input
                type="radio"
                name="event_scope"
                className="peer hidden"
                checked={selectedValue === value}
                onChange={() => onChange(value)}
            />

            {/* Custom Radio Button */}
            <div className="w-4 h-4 rounded-full border border-black bg-white flex items-center justify-center peer-checked:bg-[#9EF5CF]">
                <div className="w-2 h-2 rounded-full bg-white"></div>
            </div>

            {/* Icon + Text */}
            <div className="relative flex items-center space-x-2">
                {icon}
                <div className="text-sm">
                    <span className="font-medium">{title}</span>
                    <br />
                    {description}
                </div>
            </div>
        </label>
    );
};

export default RadioOption;
