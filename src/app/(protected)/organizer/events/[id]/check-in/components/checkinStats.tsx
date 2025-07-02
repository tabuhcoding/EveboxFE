import { FaCheckCircle } from "react-icons/fa";

export default function CheckinStats() {
    return (
        <div className="flex">
            {/* Đã check-in */}
            <div className="flex-1 bg-[#0C4762] text-white p-6 rounded-xl flex items-center">
                <div className="flex items-center gap-4 justify-start">
                    <FaCheckCircle className="w-16 h-16 text-[#51DACF] text-5xl" />
                    <div>
                        <p className="text-sm">Đã check-in</p>
                        <p className="text-2xl font-bold">0 vé</p>
                        <p className="text-sm">Đã bán 0 vé</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
