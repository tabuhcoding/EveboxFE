import { Trash2 } from "lucide-react";
import { InputItemProps } from "../../../libs/interface/comform.interface";

export default function MultipleAnswer({ value, checked, onChange, onToggle, onDelete }: InputItemProps) {
    return (
        <div className="flex items-center space-x-2 p-2">
            {/* Checkbox */}
            <div className="relative w-5 h-5 flex items-center justify-center">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={onToggle} // Gọi hàm từ cha để cập nhật trạng thái
                    className="w-5 h-5 appearance-none border-2 border-blue-500 rounded-md
                      checked:bg-green-500 checked:border-green-500"
                />
                {checked && (
                    <svg
                        className="absolute w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                    </svg>
                )}
            </div>

            {/* Input field */}
            <input
                type="text"
                placeholder="Nhập văn bản"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="text-sm block flex-1 border rounded py-3 px-4 focus:outline-black-400 border-gray-400 w-full"
            />

            {/* Delete button */}
            <Trash2 onClick={onDelete} className="p-2 bg-red-500 text-white rounded w-8 h-8 cursor-pointer" />
        </div>
    );
};