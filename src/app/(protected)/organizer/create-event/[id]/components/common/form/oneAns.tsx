/* Package System */
import { Trash2 } from "lucide-react";
import { useTranslations } from 'next-intl';

/* Package Application */
import { InputItemProps } from "../../../libs/interface/comform.interface";

export default function OneAnswer({ value, checked, onChange, onToggle, onDelete }: InputItemProps) {
    const t = useTranslations('common');

    const transWithFallback = (key: string, fallback: string) => {
        const msg = t(key);
        if (!msg || msg.startsWith('common.')) return fallback;
        return msg;
    };

    return (
        <div className="flex items-center space-x-2 p-2">
            {/* Custom Radio Button */}
            <div
                className={`w-5 h-5 flex items-center justify-center rounded-full border-2 cursor-pointer
                    ${checked ? "border-green-400 bg-green-200" : "border-gray-400"}`}
                onClick={onToggle} // Gọi hàm để thay đổi trạng thái
            >
                {checked && (
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                )}
            </div>

            {/* Input field */}
            <input
                type="text"
                placeholder={transWithFallback("hintText", "Nhập văn bản")}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="text-sm block flex-1 border rounded py-3 px-4 focus:outline-black-400 border-gray-400 w-full"
            />

            {/* Delete button */}
            <Trash2 onClick={onDelete} className="p-2 bg-red-500 text-white rounded w-8 h-8 cursor-pointer" />
        </div>
    );
};
