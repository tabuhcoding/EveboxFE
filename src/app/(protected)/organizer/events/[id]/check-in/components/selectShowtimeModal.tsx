'use client';

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { Icon } from "@iconify/react";

interface ShowtimeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (date: string, time: string) => void;
    selectedShow: { date: string, time: string };
}

export interface Showing {
    id: string;
    startTime: string;
    endTime: string;
}

export default function SelectShowtimeModal({ isOpen, onClose, onConfirm }: ShowtimeModalProps) {
    // Tạm gán cứng -> sau này gọi API
    const showings: Showing[] = [
        {
            id: 'show1',
            startTime: '2025-05-20T19:00:00Z',
            endTime: '2025-05-20T21:00:00Z',
        },
        {
            id: 'show2',
            startTime: '2025-05-21T13:00:00Z',
            endTime: '2025-05-21T15:00:00Z',
        },
        {
            id: 'show3',
            startTime: '2025-05-22T09:00:00Z',
            endTime: '2025-05-22T11:00:00Z',
        },
        {
            id: 'show4',
            startTime: '2025-05-22T16:00:00Z',
            endTime: '2025-05-22T18:30:00Z',
        },
    ];

    const [selectedShowing, setSelectedShowing] = useState<Showing>(showings[0]);

    // Handle chọn ngày
    const handleDateChange = (date: string) => {
        const filtered = showings.filter(s => s.startTime.slice(0, 10) === date);
        setSelectedShowing(filtered[0] || showings[0]); // Chọn suất đầu tiên nếu không tìm thấy
    };

    // Handle chọn giờ
    const handleTimeChange = (id: string) => {
        const selected = showings.find(s => s.id === id);
        if (selected) setSelectedShowing(selected);
    };

    return (
        <Dialog open={isOpen} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 2, overflow: 'hidden' } }}>
            <div className="bg-[#0C4762] text-white px-6 py-4 flex justify-center items-center relative rounded-t-md">
                <DialogTitle className="!m-0 !p-0 text-lg text-center font-bold">Danh sách suất diễn</DialogTitle>
                <IconButton onClick={onClose} sx={{ color: 'white' }} className="!absolute top-2 right-2 text-white">
                    <Icon icon="ic:baseline-close" width="24" height="24" />
                </IconButton>
            </div>

            <DialogContent className="!pt-6 !pb-4">
                <div className="space-y-4">
                    {/* Chọn ngày */}
                    <div>
                        <p className="text-sm font-medium text-gray-700">Ngày diễn</p>
                        <select
                            value={selectedShowing.startTime.slice(0, 10)}
                            onChange={(e) => handleDateChange(e.target.value)}
                            className="w-full border p-2 rounded mt-1"
                        >
                            {[...new Set(showings.map(s => s.startTime.slice(0, 10)))].map(date => (
                                <option key={date} value={date}>
                                    {new Date(date).toLocaleDateString('vi-VN')}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Chọn suất diễn */}
                    <div>
                        <p className="text-sm font-medium text-gray-700">Suất diễn</p>
                        <select
                            value={selectedShowing.id}
                            onChange={(e) => handleTimeChange(e.target.value)}
                            className="w-full border p-2 rounded mt-1"
                        >
                            {showings
                                .filter(s => s.startTime.slice(0, 10) === selectedShowing.startTime.slice(0, 10))
                                .map(s => (
                                    <option key={s.id} value={s.id}>
                                        {new Date(s.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                        {' - '}
                                        {new Date(s.endTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                    </option>
                                ))}
                        </select>
                    </div>

                    {/* Xác nhận chọn suất diễn */}
                    <button
                        onClick={() => {
                            const timeRange = `${new Date(selectedShowing.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} - ${new Date(selectedShowing.endTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`;
                            onConfirm(selectedShowing.startTime.slice(0, 10), timeRange);
                            onClose();
                        }}
                        className="w-full bg-[#51DACF] text-[#0C4762] py-2 rounded mt-4 font-semibold hover:bg-[#0C4762] hover:text-white transition"
                    >
                        Xác nhận
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
