"use client";

/* Package System */
import React, { useState } from 'react';
import 'tailwindcss/tailwind.css';
import { Divider } from '@nextui-org/react';
import { useRouter, useParams } from 'next/navigation';

/* Package Application */
import Navigation from '../common/navigation';
import FormTimeTypeTicketClient from './components/formTimeType';
// import { Showtime, TimeAndTypeTicketsProps } from '../../libs/interface/idevent.interface';
import { Showtime } from '../../libs/interface/idevent.interface';
import toast from 'react-hot-toast';
import { createShowing, createTicketType, getAllShowingDetailOfEvent, updateShowing, updateTicketType } from 'services/org.service';

export default function TimeAndTypeTickets() {
    const params = useParams();
    const eventId = parseInt(params?.id?.toString() || "");
    const router = useRouter();
    const [step] = useState(2);
    const [btnValidate2, setBtnValidte2] = useState("");
    

    // New state to store showtimes received from FormTimeTypeTicketClient
    const [showingList, setShowingList] = useState<Showtime[]>([]);

   const fetchShowtimes = async () => {
  try {
    const data = await getAllShowingDetailOfEvent(eventId); // <-- new method

    if (!data || data.length === 0) {
      setShowingList([{
        id: "",
        startDate: null,
        endDate: null,
        tickets: [],
        isExpanded: true,
        showDialog: false,
        showEditDialog: false,
        showCopyTicketDialog: false,
        showConfirmDeleteDialog: false,
        showDeleteShow: false
      }]);
    } else {
      const formattedShowtimes: Showtime[] = data.map((show) => ({
        id: show.id,
        startDate: new Date(show.startTime),
        endDate: new Date(show.endTime),
        tickets: show.TicketType
          .map((ticket) => ({
            id: ticket.id,
            name: ticket.name,
            price: ticket.originalPrice.toString(),
            quantity: ticket.quantity.toString(),
            min: ticket.minQtyPerOrder.toString(),
            max: ticket.maxQtyPerOrder.toString(),
            startDate: new Date(ticket.startTime),
            endDate: new Date(ticket.endTime),
            setSelectedStartDate: () => { }, // Placeholder
            setSelectedEndDate: () => { },
            information: ticket.description,
            image: ticket.imageUrl || null,
            free: ticket.isFree,
            position: ticket.position
          }))
          .sort((a, b) => a.position - b.position),
        isExpanded: true,
        showDialog: false,
        showEditDialog: true,
        showCopyTicketDialog: false,
        showConfirmDeleteDialog: false,
        showDeleteShow: false,
      }));

      setShowingList(formattedShowtimes);
      localStorage.setItem("showtimes", JSON.stringify(formattedShowtimes));
      console.log("Showtimes saved to local storage", formattedShowtimes);
    }
  } catch (error) {
    toast.error("Error fetching showtimes: " + error);
  }
};

    
    const processShowtimeAndTickets = async (showing: Showtime, newShowId?: string) => {
        try {
            let showtimeId = showing.id; // Use existing ID or new one
            // Handle Showtime creation or update
             if (!newShowId) {
      const result = await createShowing(eventId, {
        startTime: showing.startDate?.toISOString() || "",
        endTime: showing.endDate?.toISOString() || "",
      });

      showtimeId = result.showingId;
      console.log(showingList[0])

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

    const handleSave = async () => {
        setBtnValidte2("Save");
    
        if (!showingList.length) {
            toast.error("No showtimes to save!");
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
             // Refresh showing list after saving
            await fetchShowtimes(); 
            return true;  // Indicate success
        } catch (error) {
            console.error("Error saving data:", error);
            toast.error("Unexpected error occurred. Please try again.");
            return false;  // Indicate failure
        }
    };
    
    const handleContinue = async () => {
        setBtnValidte2("Continue"); 

        if (!showingList.length) {
            console.log("No showtimes to save!");
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
            return true;  // Indicate success
        } catch (error) {
            console.error("Error saving data:", error);
            alert("Unexpected error occurred. Please try again.");
            return false;  // Indicate failure
        }
    };

    const handleNextStep = () => {
        //Tạm ẩn bước 3
        // router.push(`/organizer/create-event/${eventId}?step=setting`);
        router.push(`/organizer/create-event/${eventId}?step=questions`);
    };

    return (
        <>
            <div className="flex flex-col items-center justify-center p-10 relative">
                <span className="text-3xl font-semibold mb-6">Thời gian và loại vé</span>
                <div className="w-full flex justify-center">
                    <ol className="flex space-x-6">
                        <Navigation step={step} />
                        <div className="flex gap-4 mt-4 mb-6">
                            <button className="text-xs w-18 border-2 border-[#0C4762] text-[#0C4762] font-bold py-2 px-4 rounded bg-white hover:bg-[#0C4762] hover:text-white transition-all"
                                type="submit" form="ticket-form" onClick={handleSave}
                            >
                                Lưu
                            </button>
                        </div>

                        <div className="flex gap-4 mt-4 mb-6">
                            <button className="text-xs w-30 border-2 border-[#51DACF] text-[#0C4762] font-bold py-2 px-4 rounded bg-[#51DACF] hover:bg-[#0C4762] hover:border-[#0C4762] hover:text-white transition-all"
                                type="submit" form="ticket-form" onClick={handleContinue}>
                                Tiếp tục
                            </button>
                        </div>
                    </ol>
                </div>

                <Divider />
            </div>

            <div className="flex justify-center">
                <FormTimeTypeTicketClient onNextStep={handleNextStep} btnValidate2={btnValidate2} setShowingList={setShowingList} eventId={eventId}/>
            </div>
        </>
    );
}
