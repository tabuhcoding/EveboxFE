"use client";

import { BaseApiResponse } from "@/types/BaseApiResponse";
import { Showtime } from "../../../libs/interface/idevent.interface";
import createApiClient from '@/services/apiClient';
import toast from "react-hot-toast";


const apiClient = createApiClient(process.env.NEXT_PUBLIC_API_URL || "");


export const handleDeleteShow = async (
showtimeId: string, startDate: Date | null, endDate: Date | null, 
    setShowtimes: React.Dispatch<React.SetStateAction<Showtime[]>>,
    setDelShowtimeId: React.Dispatch<React.SetStateAction<string | null>>,
) => {
    // Filter out the showtime with matching id, startDate, and endDate
    setShowtimes((prevShowtimes) =>
        prevShowtimes.filter((showtime) =>
            showtime.id !== showtimeId || 
            (showtime.startDate?.toISOString() !== startDate?.toISOString() || 
             showtime.endDate?.toISOString() !== endDate?.toISOString())
        )
    );
    toast.success(`Deleting showtime with ID: ${showtimeId}`);
     const response = await apiClient.delete<BaseApiResponse>(
                                    `/api/org/showing/${showtimeId}`
                                );
        
      if (response.status === 200) {
        console.log(`Showtime ${showtimeId} deleted successfully!`);
                                } else {
                                    toast.error(`Error deleting showtime: ${response.statusText}`);
                                }
    setDelShowtimeId(null);
    console.log("Deleted showtime:", showtimeId);
};
