"use client";

import { TicketProps } from "../../../libs/interface/dialog.interface";
import { Showtime } from "../../../libs/interface/idevent.interface";

export const updateTicket = (
    showtimeIndex: number,
    ticketIndex: number,
    updatedTicket: TicketProps,
    setShowtimes: React.Dispatch<React.SetStateAction<Showtime[]>>,
    setEditShowtimeId: React.Dispatch<React.SetStateAction<string | null>>,
    setEditTicketIndex: React.Dispatch<React.SetStateAction<number | null>>
) => {
    setShowtimes((prevShowtimes) => {
        const updatedShowtimes = [...prevShowtimes];
        const updatedTickets = [...updatedShowtimes[showtimeIndex].tickets];
        updatedTickets[ticketIndex] = updatedTicket;

        updatedShowtimes[showtimeIndex] = {
            ...updatedShowtimes[showtimeIndex],
            tickets: updatedTickets
        };

        return updatedShowtimes;
    });

    setEditShowtimeId(null);
    setEditTicketIndex(null);
};
