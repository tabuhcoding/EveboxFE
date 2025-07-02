import toast from "react-hot-toast";
import { Showtime } from "../../../libs/interface/idevent.interface";

export const handleCopyTickets = (
selectedShowtimeId: string | null, showtimes: Showtime[], currentShowtimeId: string, startDate: Date | null, endDate: Date | null, setShowtimes: (updatedShowtimes: Showtime[]) => void, onClose: () => void) => {
    if (!selectedShowtimeId) {
        toast.error("Vui lòng chọn suất diễn để sao chép vé!");
        return;
    }

    const sourceShowtime = showtimes.find(show => show.id === selectedShowtimeId);
    const targetShowtimeIndex = showtimes.findIndex(show => show.startDate?.toISOString() === startDate?.toISOString() && show.endDate?.toISOString() === endDate?.toISOString());

    if (sourceShowtime && targetShowtimeIndex !== -1) {
        const updatedShowtimes = [...showtimes];

        // Filter tickets where ticket.endDate < targetShowtime.startDate
        const filteredTickets = sourceShowtime.tickets.filter(ticket => 
            ticket.endDate && startDate &&
            new Date(ticket.endDate) < new Date(startDate)
        );

        if (filteredTickets.length === 0) {
            toast.error("Không có vé nào hợp lệ để sao chép!");
            return;
        }

        // Copy tickets and reset their id
        const copiedTickets = filteredTickets.map(ticket => ({
            ...ticket,
            id: "" // Reset ticket ID
        }));
        console.log("Copied tickets:", copiedTickets);

        updatedShowtimes[targetShowtimeIndex] = {
            ...updatedShowtimes[targetShowtimeIndex],
            tickets: copiedTickets
        };

        setShowtimes(updatedShowtimes);
        console.log("Updated showtimes:", updatedShowtimes);

        onClose();  // Close modal after copying
    }
};