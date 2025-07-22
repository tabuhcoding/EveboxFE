"use client";

/* Package System */
import { ChevronDown, ChevronUp, CirclePlus, X, PencilLine, Ticket, Trash2 } from "lucide-react";
import { useEffect, useState } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import { Toaster, toast } from "react-hot-toast";
import { useTranslations } from 'next-intl';

/* Package Application */
import DateTimePicker from "../../common/form/dateTimePicker";
import CreateTypeTicketDailog from "./dialogs/createTicketsDailog";
import EditTicketDailog from "./dialogs/editTicketDailog";
import { Showtime } from "../../../libs/interface/idevent.interface";
import ConfirmDeleteTicketDialog from "./dialogs/confirmDeleteTicket";
import ConfirmDeleteShowDialog from "./dialogs/confirmDeleteShow";
import { handleDeleteTicket } from "../../../libs/functions/showing/deleteTicket";
import { updateTicket } from "../../../libs/functions/showing/updateTicket";
import { addTicket } from "../../../libs/functions/showing/addTicket";
import { validateStartDate, validateEndDate, validateTimeSelection } from "../../../libs/functions/showing/validationUtils";
import { toggleExpanded, toggleDialog, toggleEditDialog, toggleDelDialog, toggleCopyTicketDialog, toggleDelShowDialog } from "../../../libs/functions/showing/toggleDialogUtils";
import CopyTicketDailog from "./dialogs/copyTicket";
import { handleDeleteShow } from "../../../libs/functions/showing/deleteShow";
import { getAllShowingDetailOfEvent } from "services/org.service";

export default function FormTimeTypeTicketClient({ onNextStep, btnValidate2, setShowingList, eventId }: { onNextStep: () => void, btnValidate2: string, setShowingList: (showtimes: Showtime[]) => void, eventId: number }) {
    const t = useTranslations('common');

    const transWithFallback = (key: string, fallback: string) => {
        const msg = t(key);
        if (!msg || msg.startsWith('common.')) return fallback;
        return msg;
    };

    //Chỉnh sửa vé đã tạo
    const [editShowtimeId, setEditShowtimeId] = useState<string | null>(null);
    const [editTicketIndex, setEditTicketIndex] = useState<number | null>(null);

    //Xóa vé
    const [delShowtimeId, setDelShowtimeId] = useState<string | null>(null);
    const [delTicketIndex, setDelTicketIndex] = useState<number | null>(null);

    const [, setErrors] = useState<{ [key: string]: boolean }>({});

    //Tạo suất diễn
    const [showtimes, setShowtimes] = useState<Showtime[]>([
        {
            id: "", startDate: null, endDate: null, tickets: [], isExpanded: true, showDialog: false,
            showEditDialog: false, showCopyTicketDialog: false, showConfirmDeleteDialog: false, showDeleteShow: false
        }
    ]);

    useEffect(() => {
        const fetchShowtimes = async () => {
            try {
                const data = await getAllShowingDetailOfEvent(Number(eventId));

                if (!data || data.length === 0) {
                    setShowtimes([{
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
                                setSelectedStartDate: () => { },
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

                    setShowtimes(formattedShowtimes);
                    localStorage.setItem("showtimes", JSON.stringify(formattedShowtimes));
                    console.log("Showtimes saved to local storage", formattedShowtimes);
                }
            } catch (error) {
                toast.error("Error fetching showtimes: " + (error as Error).message);
            }
        };

        fetchShowtimes();
    }, [eventId]);

    useEffect(() => {
        setShowingList(showtimes);
    }, [showtimes, setShowingList]);

    //Filter month of showing
    const [selectedMonth, setSelectedMonth] = useState("");
    const filteredShowtimes = selectedMonth
        ? showtimes.filter((showtime) => {
            if (!showtime.startDate) return false;
            const showtimeMonth = new Date(showtime.startDate as Date).getMonth() + 1;
            return showtimeMonth === parseInt(selectedMonth);
        })
        : showtimes;

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedMonth(e.target.value);
    };

    const handleAddShowtime = () => {
        setShowtimes([...showtimes, {
            id: "", startDate: null, endDate: null, tickets: [],
            showEditDialog: false, showConfirmDeleteDialog: false, showDeleteShow: false
        }]);
        console.log('Showtime----', showtimes)
    };

    const handleSubmit = () => {
        if (event) event.preventDefault();

        const totalTickets = showtimes.reduce((count, showtime) => count + showtime.tickets.length, 0);

        if (totalTickets === 0) {
            toast.error(transWithFallback("pleaseChoseTicket", "Vui lòng tạo ít nhất một loại vé trước khi tiếp tục!"));
            return;
        }

        if (btnValidate2 === "Continue") {
            toast.success(transWithFallback("continueForm", "Form hợp lệ! Chuyển sang bước tiếp theo..."));
            onNextStep();
        }
    };

    return (
        <>
            <Toaster position="top-center" />

            <div className="w-full mt-6 mb-8">
                <form className="w-full max-w-4xl mx-auto mb-10" onSubmit={handleSubmit} id="ticket-form">
                    <div className="relative flex items-center">
                        <p className="text-xl font-bold mr-4">{transWithFallback('timeTitle', 'Thời gian')}</p>
                        <div className="relative ml-auto">
                            <select
                                className={`text-base block appearance-none w-40 border py-3 px-4 pr-8 rounded leading-tight focus:outline-black-400 
                                    ${selectedMonth === "" ? "text-gray-400" : "text-black"}`}
                                value={selectedMonth}
                                onChange={handleSelectChange}
                            >
                                <option value="">{transWithFallback('allMonth', 'Tất cả tháng')}</option>
                                {Array.from(new Set(showtimes
                                    .filter(show => show.startDate) // Lọc bỏ các startDate null
                                    .map(show => new Date(show.startDate as Date).getMonth() + 1)
                                )).map((month) => (
                                    <option key={month} value={month} className="text-black">
                                        {transWithFallback('mth', 'Tháng')} {month}
                                    </option>
                                ))}
                            </select>
                            <div className="text-gray-400 pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                                <ChevronDown size={20} />
                            </div>
                        </div>
                    </div>

                    {filteredShowtimes.map((showtime, index) => (
                        <div key={`${showtime.id}-${index}`} className="p-4 lg:p-4 rounded-lg shadow-sm w-full max-w-5xl mx-auto mt-4"
                            style={{
                                backgroundColor: "rgba(158, 245, 207, 0.2)",
                                border: showtime.tickets.length === 0 ? "1px solid red" : "1.5px solid #9EF5CF"
                            }}>
                            <div className="relative flex items-center mb-4">
                                {showtime.isExpanded ? (
                                    <>
                                        <div className="flex items-center">
                                            <ChevronUp size={20} className="cursor-pointer" onClick={() => toggleExpanded(showtime.id, setShowtimes)} />
                                            <p className="text-base font-medium ml-2">{transWithFallback('eventDate', 'Ngày sự kiện')}</p>
                                        </div>

                                        <X className="ml-auto text-red-500 rounded w-5 h-5 cursor-pointer hover:bg-red-100"
                                            onClick={() => {
                                                setDelShowtimeId(showtime.id);
                                                toggleDelShowDialog(showtime.id, setShowtimes);
                                            }} />
                                    </>
                                ) : (
                                    <>
                                        <ChevronDown size={20} className="cursor-pointer" onClick={() => toggleExpanded(showtime.id, setShowtimes)} />
                                        <div>
                                            <label className={`text-base font-medium ml-2 ${showtime.tickets.length === 0 ? "text-red-500" : "text-black"}`}>
                                                {showtime.startDate ? `${showtime.startDate.toLocaleDateString("vi-VN", { timeZone: "UTC", day: "2-digit", month: "2-digit", year: "numeric" })} - ${showtime.startDate.toLocaleString("vi-VN", { timeZone: "UTC", hour: "2-digit", minute: "2-digit" })}`
                                                    : transWithFallback("pleaseChoseShow", "Vui lòng chọn thông tin xuất diễn")}
                                            </label>
                                            <br />
                                            {showtime.tickets.length === 0 ? (
                                                showtime.startDate && <span className="text-sm ml-2">{transWithFallback('pleaseCreate', 'Vui lòng tạo ít nhất một loại vé')}</span>
                                            ) : (
                                                <span className="text-sm ml-2">{showtime.tickets.length} {transWithFallback('ticketType', 'Loại vé')}</span>
                                            )}

                                        </div>
                                    </>
                                )}
                            </div>

                            {showtime.isExpanded && (<>
                                <div className="flex flex-wrap -mx-3 mb-6">
                                    {/* Thời gian bắt đầu */}
                                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                        <DateTimePicker
                                            label={transWithFallback("startTime", "Thời gian bắt đầu")}
                                            selectedDate={showtime.startDate}
                                            setSelectedDate={(date) => {
                                                const updatedShowtimes = [...showtimes];
                                                updatedShowtimes[index].startDate = date;
                                                setShowtimes(updatedShowtimes);
                                            }}
                                            popperPlacement="bottom-end"
                                            validateDate={(date) => validateStartDate(date, showtime.endDate)}
                                        />
                                    </div>

                                    {/* Thời gian kết thúc */}
                                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                        <DateTimePicker
                                            label={transWithFallback("endTime", "Thời gian kết thúc")}
                                            selectedDate={showtime.endDate}
                                            setSelectedDate={(date) => {
                                                const updatedShowtimes = [...showtimes];
                                                updatedShowtimes[index].endDate = date;
                                                setShowtimes(updatedShowtimes);
                                            }}
                                            popperPlacement="bottom-start"
                                            validateDate={(date) => validateEndDate(date, showtime.startDate)}
                                        />
                                    </div>
                                </div>

                                <p className="block text-base font-medium mb-2">
                                    <span className="text-red-500">*</span> {transWithFallback('ticketType', 'Loại vé')}
                                </p>


                                {showtimes.length >= 2 && showtime.tickets.length === 0 && (
                                    <div className="flex gap-4 mt-4 mb-4 ml-2">
                                        <button className="w-40 text-sm border-2 border-[#2DC275] text-white font-bold py-2 px-4 rounded bg-[#2DC275] hover:bg-[#7DF7B8] hover:border-[#7DF7B8] hover:text-white transition-all"
                                            onClick={() => {
                                                if (validateTimeSelection(showtime.startDate, showtime.endDate, setErrors, t)) {
                                                    toggleCopyTicketDialog(showtime.id, setShowtimes);
                                                }
                                            }}>
                                            {transWithFallback('copyTicket', 'Copy loại vé')}
                                        </button>
                                    </div>
                                )}

                                {/* Hiển thị các loại vé đã tạo */}
                                <div className="type_ticket ">
                                    {showtime.tickets.map((ticket, ticketIndex) => (
                                        <div key={`${showtime.id}-${ticket.id}`} className="flex items-center justify-between gap-2 p-4 lg:p-6 h-14 rounded-lg shadow-sm w-full max-w-5xl mx-auto mt-4" style={{ backgroundColor: "rgba(158, 245, 207, 0.2)", border: "1.5px solid #9EF5CF" }}>
                                            <Ticket size={20} />

                                            <span>{ticket.name}</span>

                                            <div className="ml-auto flex items-center gap-2">
                                                <PencilLine className="p-2 bg-white text-black rounded w-8 h-8 cursor-pointer"
                                                    onClick={() => {
                                                        setEditShowtimeId(showtime.id);
                                                        setEditTicketIndex(ticketIndex);
                                                        toggleEditDialog(showtime.id, setShowtimes);
                                                    }}

                                                />

                                                {showtime.showEditDialog && editShowtimeId === showtime.id && editTicketIndex !== null && (
                                                    <EditTicketDailog
                                                        open={true}
                                                        onClose={() => setEditShowtimeId("")}
                                                        startDateEvent={showtime.startDate}
                                                        endDateEvent={showtime.endDate}
                                                        ticket={showtime.tickets[editTicketIndex]}
                                                        updateTicket={(updatedTicket) => updateTicket(index, editTicketIndex, updatedTicket, setShowtimes, setEditShowtimeId, setEditTicketIndex)
}
                                                    />)}

                                                <Trash2 className="p-2 bg-red-500 text-white rounded w-8 h-8 cursor-pointer"
                                                    onClick={() => {
                                                        setDelShowtimeId(showtime.id);
                                                        setDelTicketIndex(ticketIndex);
                                                        toggleDelDialog(showtime.id, setShowtimes);
                                                    }}
                                                />

                                                {showtime.showConfirmDeleteDialog && delShowtimeId === showtime.id && delTicketIndex !== null &&
                                                    (<ConfirmDeleteTicketDialog
                                                        open={showtime.showConfirmDeleteDialog}
                                                        onClose={() => setDelShowtimeId(null)}
                                                        onConfirm={() => {
                                                            handleDeleteTicket(showtime.id, delTicketIndex, setShowtimes, setDelShowtimeId, setDelTicketIndex);

                                                            console.log(delTicketIndex);
                                                        }}
                                                    />)}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-center mt-4">
                                    <button type="button" className="text-base font-medium flex items-center gap-1 my-2 text-[#2DC275]"
                                        onClick={() => {
                                            if (validateTimeSelection(showtime.startDate, showtime.endDate, setErrors, t)) {
                                                toggleDialog(showtime.id, setShowtimes);
                                            }
                                        }}>
                                        <CirclePlus size={20} /> {transWithFallback('btnCreateTicket', 'Tạo loại vé mới')}
                                    </button>

                                    {showtime.showDialog &&
                                        <CreateTypeTicketDailog
                                            open={showtime.showDialog}
                                            onClose={() =>
                                                toggleDialog(showtime.id, setShowtimes)}
                                            startDate={showtime.startDate}
                                            endDate={showtime.endDate}
                                            addTicket={(newTicket) => addTicket(index, newTicket, setShowtimes)}
                                        />}
                                    {showtime.showCopyTicketDialog &&
                                        <CopyTicketDailog
                                            open={showtime.showCopyTicketDialog}
                                            onClose={() =>
                                                toggleCopyTicketDialog(showtime.id, setShowtimes)}
                                            showtimes={showtimes}
                                            currentShowtimeId={showtime.id}
                                            startDate={showtime.startDate}
                                            endDate={showtime.endDate}
                                            setShowtimes={setShowtimes}
                                        />}
                                </div>
                                {showtime.showDeleteShow &&
                                    (<ConfirmDeleteShowDialog
                                        open={showtime.showDeleteShow}
                                        onClose={() => setShowtimes(prevShowtimes =>
                                            prevShowtimes.map(s =>
                                                s.id === showtime.id ? { ...s, showDeleteShow: false } : s
                                            )
                                        )}
                                        onConfirm={() => {
                                            handleDeleteShow(showtime.id, showtime.startDate, showtime.endDate, setShowtimes, setDelShowtimeId);

                                        }}
                                    />)}
                            </>)}
                        </div>
                    ))}


                    <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />

                    <div className="flex justify-center mb-10">
                        <button
                            type="button" onClick={handleAddShowtime}
                            className="text-base font-medium flex items-center gap-1 my-2 text-[#2DC275]"
                        >
                            <CirclePlus size={20} /> {transWithFallback('btnCreateShow', 'Tạo suất diễn')}
                        </button>
                    </div>
                </form >
            </div>
        </>
    );
}
