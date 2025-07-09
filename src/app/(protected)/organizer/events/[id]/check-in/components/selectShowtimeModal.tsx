'use client';

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { Icon } from "@iconify/react";
import { IShowTime } from "@/types/models/org/orgEvent.interface";
import { getShowingsByEventId } from "@/services/org.service";

interface ShowtimeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (id: string, date: string, time: string) => void;
    selectedShow: { id: string, date: string, time: string };
    setSelectedShow: React.Dispatch<React.SetStateAction<{ id: string; date: string; time: string }>>;

    eventId: number; 
}

export default function SelectShowtimeModal({ isOpen, onClose, onConfirm, setSelectedShow, eventId }: ShowtimeModalProps) {
    // Tạm gán cứng -> sau này gọi API
    const [showings, setShowings] = useState<IShowTime[]>([]);
  const [selectedShowing, setSelectedShowing] = useState<IShowTime | null>(null);

  useEffect(() => {
    if (!eventId || !isOpen) return;

    const fetchShowings = async () => {
      try {
        const data = await getShowingsByEventId(eventId);
        setShowings(data);
        if (data.length > 0) {
          setSelectedShowing(data[0]);
        }

        const start = new Date(selectedShowing?.startTime || "");
  const end = new Date(selectedShowing?.endTime || "");
  const formattedTime = `${start.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  })} - ${end.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;

  setSelectedShow({
    id: selectedShowing?.id || "",
    date: start.toISOString().slice(0, 10),
    time: formattedTime,
  });
      } catch (err) {
        console.error("Failed to load showings:", err);
      }
    };

    fetchShowings();
  }, [eventId, isOpen]);

    // Handle chọn ngày
    const handleDateChange = (date: string) => {
    const filtered = showings.filter(s => s.startTime.toString().slice(0, 10) === date);
    if (filtered.length > 0) setSelectedShowing(filtered[0]);
  };

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
  value={selectedShowing?.startTime.toString().slice(0, 10)}
  onChange={(e) => handleDateChange(e.target.value)}
  className="w-full border p-2 rounded mt-1"
>
  {[...new Set(showings.map(s => s.startTime.toString().slice(0, 10)))].map(date => (
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
  value={selectedShowing?.id}
  onChange={(e) => handleTimeChange(e.target.value)}
  className="w-full border p-2 rounded mt-1"
>
  {showings
    .filter(s => s.startTime.toString().slice(0, 10) === selectedShowing?.startTime.toString().slice(0, 10))
    .map(s => (
      <option key={s.id} value={s.id}>
        {new Date(s.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} - {new Date(s.endTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
      </option>
    ))}
</select>
                    </div>

                    {/* Xác nhận chọn suất diễn */}
                    <button
  onClick={() => {
    if (!selectedShowing) return;
    const timeRange = `${new Date(selectedShowing.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} - ${new Date(selectedShowing.endTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`;
    onConfirm(selectedShowing.id, selectedShowing.startTime.toString().slice(0, 10), timeRange);
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
