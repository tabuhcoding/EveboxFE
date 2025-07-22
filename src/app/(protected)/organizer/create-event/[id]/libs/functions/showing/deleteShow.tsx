"use client";

import { Showtime } from "../../../libs/interface/idevent.interface";
import toast from "react-hot-toast";
import { deleteShowing } from "services/org.service";

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
    toast.success(`Deleting showtime successfully`);
     
    try {
      if (showtimeId && showtimeId!=""){
         await deleteShowing(showtimeId); 
      }
       console.log(`Showtime ${showtimeId} deleted successfully!`);
  } catch (error: any) {
    toast.error(`Error deleting showtime: ${error.message}`);
  }
    setDelShowtimeId(null);
    console.log("Deleted showtime:", showtimeId);
};
