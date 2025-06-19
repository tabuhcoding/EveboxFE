"use client";

import { Showtime } from "../../../libs/interface/idevent.interface";
import toast from "react-hot-toast";
import { deleteTicketType } from "services/org.service";

export const handleDeleteTicket = async (
    showtimeId: string,
    ticketIndex: number,
    setShowtimes: React.Dispatch<React.SetStateAction<Showtime[]>>,
    setDelShowtimeId: React.Dispatch<React.SetStateAction<string | null>>,
    setDelTicketIndex: React.Dispatch<React.SetStateAction<number | null>>
) => {
    setShowtimes((prevShowtimes) => {
        return prevShowtimes.map((showtime) => {
            if (showtime.id === showtimeId) {
                const ticketToDelete = showtime.tickets[ticketIndex];

                 if (ticketToDelete?.id) {
          // Use shared deleteTicketType service
          deleteTicketType(ticketToDelete.id)
            .then(() => {
              toast.success(`Ticket ${ticketToDelete.id} deleted successfully.`);
            })
            .catch((error) => {
              toast.error("Error deleting ticket: " + error.message);
            });
        }

                return {
                    ...showtime,
                    tickets: showtime.tickets.filter((_, index) => index !== ticketIndex),
                    showConfirmDeleteDialog: false,
                    selectedTicketIndex: null,
                };
            }
            return showtime;
        });
    });

    setDelShowtimeId("");
    setDelTicketIndex(null);
};
