'use client'

/* Package System */
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { Icon } from "@iconify/react";
import { ChevronDown } from "lucide-react";
import { useTranslations } from 'next-intl';

/* Package Application */
import { CopyTicketDailogProps } from "../../../../libs/interface/dialog.interface";
import { handleCopyTickets } from "../../../../libs/functions/showing/copyTicket";
import { useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function CopyTicketDailog({ open, onClose, showtimes, currentShowtimeId, setShowtimes, startDate, endDate }: CopyTicketDailogProps) {
    const [selectedShowtimeId, setSelectedShowtimeId] = useState<string | null>(null);

    const validShowtimes = showtimes.filter(showtime =>
        showtime.tickets.length > 0 && showtime.tickets.some(ticket => ticket.id !== "")
    );

    const t = useTranslations('common');

    const transWithFallback = (key: string, fallback: string) => {
        const msg = t(key);
        if (!msg || msg.startsWith('common.')) return fallback;
        return msg;
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} >
                <div className="text-white dialog-header px-6 py-2 pb-4  justify-center items-center flex relative" style={{ background: '#0C4762' }}>
                    <DialogTitle className="!m-0 !p-0 text-lg text-center font-bold">{transWithFallback('copyTicket', 'Copy loại vé')}</DialogTitle>
                    <button onClick={onClose} className="absolute right-2 top-2 px-1 py-1 close-btn">
                        <Icon icon="ic:baseline-close" width="20" height="20" />
                    </button>
                </div>

                <DialogContent sx={{ overflowY: "auto", maxHeight: "70vh" }}>
                    <div className="content mx-4">
                        <div className="flex flex-wrap -mx-3 mb-6">
                            <p className="block text-sm font-bold mb-2">
                                {transWithFallback('contentCopy', 'Chọn suất diễn muốn copy loại vé')}
                            </p>
                            <div className="relative w-full">
                                <select
                                    className="text-sm block w-full border py-3 px-4 pr-8 rounded leading-tight focus:outline-black-400 appearance-none text-gray-500"
                                    value={selectedShowtimeId || ""}
                                    onChange={(e) => setSelectedShowtimeId(e.target.value)}
                                >
                                    <option value="" disabled>
                                        {transWithFallback('selectShow', '--- Chọn suất diễn ---')}
                                    </option>
                                    {validShowtimes.map((showtime) => (
                                        <option value={showtime.id} key={showtime.id} className="text-black">
                                            {showtime.startDate
                                                ? `${showtime.startDate.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })} - ${showtime.startDate.toLocaleString("vi-VN", { hour: "2-digit", minute: "2-digit" })}`
                                                : transWithFallback("noDate", "Chưa có ngày")}
                                        </option>
                                    ))}
                                </select>
                                <div className="text-gray-400 pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                                    <ChevronDown size={20} />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center gap-4 mt-4 mb-4">
                            <button onClick={onClose} className="w-32 border-2 border-gray-500 text-gray-500 font-bold py-2 px-4 rounded bg-white hover:bg-gray-500 hover:text-white transition-all">
                                {transWithFallback('btnCancel', 'Hủy')}
                            </button>

                            <button
                                className="w-32 border-2 border-[#0C4762] text-[#0C4762] font-bold py-2 px-4 rounded bg-white hover:bg-[#0C4762] hover:text-white transition-all"
                                onClick={() => handleCopyTickets(selectedShowtimeId, showtimes, currentShowtimeId, startDate, endDate, setShowtimes, onClose)}
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
