"use client";

import { TicketProps } from "../../../libs/interface/dialog.interface";
import { Showtime } from "../../../libs/interface/idevent.interface";

export const addTicket = (
    showtimeIndex: number,
    newTicket: TicketProps,
    setShowtimes: React.Dispatch<React.SetStateAction<Showtime[]>>
) => {
    setShowtimes((prevShowtimes) => {
        const updatedShowtimes = [...prevShowtimes];
        const updatedTickets = [...updatedShowtimes[showtimeIndex].tickets, newTicket].sort(
            (a, b) => parseFloat(a.price) - parseFloat(b.price)
        );

        updatedShowtimes[showtimeIndex] = {
            ...updatedShowtimes[showtimeIndex],
            tickets: updatedTickets,
        };

        return updatedShowtimes;
    });
};
