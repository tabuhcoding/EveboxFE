"use client";

/* Package System */
import React, { useState, useRef } from 'react';
import 'tailwindcss/tailwind.css';
import { Divider } from '@nextui-org/react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
// import { CircularProgress } from '@mui/material';

/* Package Application */
import Navigation from '../common/navigation';
import FormTimeTypeTicketClient from './components/formTimeType';
// import { Showtime, TimeAndTypeTicketsProps } from '../../libs/interface/idevent.interface';
import { Showtime } from '../../libs/interface/idevent.interface';
import toast from 'react-hot-toast';
import { createShowing, createTicketType, updateShowing, updateTicketType } from 'services/org.service';

export default function TimeAndTypeTickets() {
    const params = useParams();
    const eventId = parseInt(params?.id?.toString() || "");
    const router = useRouter();
    const [step] = useState(2);
    const [btnValidate2, setBtnValidte2] = useState("");
    // const [isContinuing, setIsContinuing] = useState(false);
    const formRef = useRef<any>(null);
    const t = useTranslations('common');

    const transWithFallback = (key: string, fallback: string) => {
        const msg = t(key);
        if (!msg || msg.startsWith('common.')) return fallback;
        return msg;
    };

    // New state to store showtimes received from FormTimeTypeTicketClient
    const [showingList, setShowingList] = useState<Showtime[]>([]);

    const processShowtimeAndTickets = async (showing: Showtime, newShowId?: string) => {
        try {
            let showtimeId = showing.id; // Use existing ID or new one
            // Handle Showtime creation or update
            if (!newShowId || newShowId==="") {
                const result = await createShowing(eventId, {
                    startTime: showing.startDate?.toISOString() || "",
                    endTime: showing.endDate?.toISOString() || "",
                });

                console.log(result.toString());

                showtimeId = result.toString();

                console.log(`Showtime created successfully! ID: ${showtimeId}`);
            } else {
                await updateShowing(showing.id, {
                    startTime: showing.startDate?.toISOString() || "",
                    endTime: showing.endDate?.toISOString() || ""
                });

                console.log(`Showtime ${showing.id} updated successfully!`);
            }

            // Ensure `showtimeId` is valid
            if (!showtimeId) {
                console.error("Showtime ID is missing after creation!");
                return;
            }

            // Process tickets for the current showtime
            await Promise.all(
                showing.tickets.map(async (ticket, index) => {
                    try {
                        const ticketPayload = {
                            status: 'BOOK_NOW',
                            name: ticket.name,
                            description: ticket.information,
                            color: '#000000',
                            isFree: ticket.free,
                            originalPrice: Number(ticket.price),
                            startTime: (ticket.startDate ?? new Date()).toISOString(),
                            endTime: (ticket.endDate ?? new Date()).toISOString(),
                            position: index,
                            quantity: ticket.quantity ? Number(ticket.quantity) : undefined,
                            maxQtyPerOrder: Number(ticket.max),
                            minQtyPerOrder: Number(ticket.min),
                            imageUrl: typeof ticket.image === 'string' ? ticket.image : '', // Only accept string URL here
                            isHidden: false,
                        };


                        if (!ticket.id) {
                            // Create
                            await createTicketType(showtimeId, ticketPayload);
                            console.log(`Ticket created successfully`);
                        } else {
                            // Update
                            await updateTicketType(ticket.id, ticketPayload);
                            console.log(`Ticket ${ticket.id} updated successfully`);
                        }
                    } catch (error) {
                        console.error(`Failed to process ticket:`, error);
                        toast.error(`Error saving ticket data.`);
                    }
                })
            );
        } catch (error) {
            console.error(`Failed to process showtime:`, error);
            toast.error(`Error saving showtime data.`);
        }
    };

    const handleContinue = async () => {
        setBtnValidte2("Continue");
        // setIsContinuing(true);

        const isValid = await formRef.current?.validateAndSubmit();
        if (!isValid) {
            // setIsContinuing(false);
            return;
        }

        if (!showingList.length) {
            console.log("No showtimes to save!");
            // setIsContinuing(false);
            return;
        }

        try {
            // Process showings and tickets concurrently
            await Promise.all(
                showingList.map(async (showing) => {
                    const newShowId = showing.id;
                    await processShowtimeAndTickets(showing, newShowId);
                })
            );
            console.log("All showtimes and tickets processed.");
            handleNextStep();
            return true;  // Indicate success
        } catch (error) {
            console.error("Error saving data:", error);
            alert("Unexpected error occurred. Please try again.");
            return false;  // Indicate failure
        } finally {
            // setIsContinuing(false);
        }
    };

    const handleNextStep = () => {
        router.push(`/organizer/create-event/${eventId}?step=questions`);
    };

    return (
        <>
            <div className="flex flex-col items-center justify-center p-10 relative">
                <span className="text-3xl font-semibold mb-6">{transWithFallback("timeType", "Thời gian và loại vé")}</span>
                <div className="w-full flex justify-center">
                    <ol className="flex space-x-6">
                        <Navigation step={step} />
                        <div className="flex gap-4 mt-4 mb-6">
                            <button className="text-xs w-30 border-2 border-[#51DACF] text-[#0C4762] font-bold py-2 px-4 rounded bg-[#51DACF] hover:bg-[#0C4762] hover:border-[#0C4762] hover:text-white transition-all"
                                type="submit" form="ticket-form" onClick={handleContinue}>
                                {transWithFallback("continue", "Tiếp tục")}
                            </button>
                        </div>
                    </ol>
                </div>

                <Divider />
            </div>

            <div className="flex justify-center">
                <FormTimeTypeTicketClient onNextStep={handleNextStep} btnValidate2={btnValidate2} setShowingList={setShowingList} eventId={eventId} ref={formRef} />
            </div>
        </>
    );
}
