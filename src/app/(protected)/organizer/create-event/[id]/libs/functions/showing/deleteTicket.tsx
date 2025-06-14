"use client";

import { Showtime } from "../../../libs/interface/idevent.interface";
import { BaseApiResponse } from "@/types/BaseApiResponse";
import createApiClient from '@/services/apiClient';
import toast from "react-hot-toast";


const apiClient = createApiClient(process.env.NEXT_PUBLIC_API_URL || "");

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
                    // Call API to delete ticket
                    apiClient.delete<BaseApiResponse>(`/api/org/ticketType/${ticketToDelete.id}`)
                        .then((response) => {
                            if (response.status === 200) {
                                toast.success(`Ticket ${ticketToDelete.id} deleted successfully.`);
                            } else {
                                toast.error(`Failed to delete ticket: ${response.statusText}`);
                            }
                        })
                        .catch((error) => {
                            toast.error("Error deleting ticket:"+error);
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
