import { TicketProps } from "./dialog.interface";

export interface SettingProps {
    eventId: number;
}

export interface TimeAndTypeTicketsProps {
    eventId: number;
}

export interface Showtime {
    id: string;
    startDate: Date | null;
    endDate: Date | null;
    tickets: TicketProps[];
    isExpanded?: boolean;
    showDialog?: boolean;
    showEditDialog?: boolean;
    showCopyTicketDialog?: boolean;
    showConfirmDeleteDialog?: boolean;
    showDeleteShow?: boolean;
}
