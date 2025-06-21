"use client";

import { TicketProps } from "../../../libs/interface/dialog.interface";
import { Showtime } from "../../../libs/interface/idevent.interface";

export const addTicket = (
    showtimeId: string, 
    newTicket: TicketProps,
    setShowtimes: React.Dispatch<React.SetStateAction<Showtime[]>>
) => {
    setShowtimes((prevShowtimes) =>
        prevShowtimes.map((showtime) =>
            showtime.id === showtimeId
                ? { 
                    ...showtime, 
                    tickets: [...showtime.tickets, newTicket].sort((a, b) => 
                        parseFloat(a.price) - parseFloat(b.price)
                    ) 
                }
                : showtime
        )
    );
};