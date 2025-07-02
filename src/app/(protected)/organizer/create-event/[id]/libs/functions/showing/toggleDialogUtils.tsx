import { Showtime } from "../../../libs/interface/idevent.interface";

export const toggleExpanded = (
    id: string,
    setShowtimes: React.Dispatch<React.SetStateAction<Showtime[]>>
) => {
    setShowtimes((prevShowtimes) =>
        prevShowtimes.map((showtime) =>
            showtime.id === id ? { ...showtime, isExpanded: !showtime.isExpanded } : showtime
        )
    );
};

export const toggleDialog = (
    id: string,
    setShowtimes: React.Dispatch<React.SetStateAction<Showtime[]>>
) => {
    setShowtimes((prevShowtimes) =>
        prevShowtimes.map((showtime) =>
            showtime.id === id ? { ...showtime, showDialog: !showtime.showDialog } : showtime
        )
    );
};

export const toggleEditDialog = (
    id: string,
    setShowtimes: React.Dispatch<React.SetStateAction<Showtime[]>>
) => {
    setShowtimes((prevShowtimes) =>
        prevShowtimes.map((showtime) =>
            showtime.id === id ? { ...showtime, showEditDialog: !showtime.showEditDialog } : showtime
        )
    );
};

export const toggleDelDialog = (
    id: string,
    setShowtimes: React.Dispatch<React.SetStateAction<Showtime[]>>
) => {
    setShowtimes((prevShowtimes) =>
        prevShowtimes.map((showtime) =>
            showtime.id === id ? { ...showtime, showConfirmDeleteDialog: !showtime.showConfirmDeleteDialog } : showtime
        )
    );
};

export const toggleDelShowDialog = (
    id: string,
    setShowtimes: React.Dispatch<React.SetStateAction<Showtime[]>>
) => {
    setShowtimes((prevShowtimes) =>
        prevShowtimes.map((showtime) => {
            if (showtime.id === id) {
                return { ...showtime, showDeleteShow: !showtime.showDeleteShow };
            }
            return showtime;
        })
    );
};

export const toggleCopyTicketDialog = (
    id: string,
    setShowtimes: React.Dispatch<React.SetStateAction<Showtime[]>>
) => {
    setShowtimes((prevShowtimes) =>
        prevShowtimes.map((showtime) =>
            showtime.id === id ? { ...showtime, showCopyTicketDialog: !showtime.showCopyTicketDialog } : showtime
        )
    );
};