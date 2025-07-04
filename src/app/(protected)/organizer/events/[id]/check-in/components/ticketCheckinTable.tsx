'use client'

/* Package System */
import { useState, useEffect } from "react";

/* Package Application */
import { TicketCheckin } from "../lib/interface/check-in.interface";
import { TicketCheckinTableProps } from "../lib/interface/check-in.interface";
import Pagination from "./common/pagination";
import { sortUsers } from "@/app/(protected)/admin/account-management/libs/function/sortUsers";
import SortIcon from "@/app/(protected)/admin/account-management/_components/sortIcon";

export default function TicketCheckinTable({ activeTab, searchKeyword }: TicketCheckinTableProps) {
    //Gán cứng
    const data: TicketCheckin[] = [
        {
            orderId: 'OD8492TH',
            ticket: {
                id: 'TKX-58J2KQ',
                type: 'Vé cứng',
            },
            showing: {
                startTime: '2025-04-29T18:00:00Z',
                endTime: '2025-04-29T20:00:00Z',
            },
            venue: 'TẦNG 12B TÒA NHÀ IMC',
        },
        {
            orderId: 'OD1157NV',
            ticket: {
                id: 'TKX-94XZTP',
                type: 'Vé điện tử',
            },
            showing: {
                startTime: '2025-04-29T13:00:00Z',
                endTime: '2025-04-29T15:00:00Z',
            },
            venue: 'TẦNG 12B TÒA NHÀ IMC',
        },
        {
            orderId: 'OD8492TH',
            ticket: {
                id: 'TKX-73LMN8',
                type: 'Vé cứng',
            },
            showing: {
                startTime: '2025-04-29T18:00:00Z',
                endTime: '2025-04-29T20:00:00Z',
            },
            venue: 'TẦNG 12B TÒA NHÀ IMC',
        },
        {
            orderId: 'OD6623AB',
            ticket: {
                id: 'TKX-31KPLD',
                type: 'Vé điện tử',
            },
            showing: {
                startTime: '2025-04-29T09:00:00Z',
                endTime: '2025-04-29T11:00:00Z',
            },
            venue: 'TẦNG 12B TÒA NHÀ IMC',
        },
    ];

    const [tickets, setTickets] = useState<TicketCheckin[]>(data);
    const [sortConfig, setSortConfig] = useState<{ key: keyof TicketCheckin; direction: 'asc' | 'desc' } | null>(null);

    const handleSort = (key: keyof TicketCheckin) => {
        setSortConfig((prev) => {
            if (prev?.key === key) {
                return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
            } else {
                return { key, direction: 'asc' };
            }
        });
    };

    const filteredTickets = tickets.filter(ticket => {
        const matchSearch = ticket.orderId.toLowerCase().includes(searchKeyword.toLowerCase());

        let matchTab = false;

        switch (activeTab) {
            case "all":
                matchTab = true;
                break;
            case "e-ticket":
                matchTab = ticket.ticket.type === "Vé điện tử";
                break;
            case "ticket":
                matchTab = ticket.ticket.type === "Vé cứng";
                break;
            default:
                matchTab = true;
        }

        return matchSearch && matchTab;
    });

    //Pagination
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab]);

    const totalItems = filteredTickets.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(startItem + itemsPerPage - 1, totalItems);

    const handlePrevious = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const sortedTickets = sortUsers(filteredTickets, sortConfig);

    const paginatedData = sortedTickets.slice(startItem - 1, endItem);

    return (
        <>
            <div className="table-account-management overflow-x-auto rounded-xl shadow-md mt-6">
                <table className="min-w-full border border-gray-200">
                    <thead>
                        <tr className="bg-[#0C4762] text-white text-sm text-left rounded-t-lg">
                            <th className="px-4 py-3 text-center">STT</th>
                            <th className="px-4 py-3 cursor-pointer text-center" onClick={() => handleSort('orderId')}>
                                Mã đơn hàng <SortIcon field="orderId" sortConfig={sortConfig} />
                            </th>
                            <th className="px-4 py-3 cursor-pointer text-center">
                                Mã vé
                            </th>
                            <th className="px-4 py-3 cursor-pointer text-center">
                                Ngày diễn
                            </th>
                            <th className="px-4 py-3 cursor-pointer text-center" >
                                Thời gian diễn ra 
                            </th>
                            <th className="px-4 py-3 cursor-pointer text-center" >
                                Địa điểm
                            </th>
                            <th className="px-4 py-3 cursor-pointer text-center" >
                                Loại vé
                            </th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {paginatedData.length > 0 ? (
                            paginatedData.map((ticket, index) => (
                                <tr key={index} className="border-t border-gray-200 hover:bg-gray-200 transition-colors duration-200">
                                    <td className="px-4 py-3 text-center border-r border-gray-200">{index + 1}</td>
                                    <td className="px-4 py-3 border-r border-gray-200 cursor-pointer">
                                        {ticket.orderId}
                                    </td>
                                    <td className="px-4 py-3 border-r border-gray-200">{ticket.ticket.id}</td>
                                    <td className="px-4 py-3 border-r border-gray-200 text-center">{new Date(ticket.showing.startTime).toLocaleDateString('vi-VN')}</td>
                                    <td className="px-4 py-3 text-center border-r border-gray-200">
                                        {new Date(ticket.showing.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} - {new Date(ticket.showing.endTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                    </td>
                                    <td className="px-4 py-3 border-r border-gray-200">{ticket.venue}</td>
                                    <td className="px-4 py-3 text-center border-r cursor-pointer">
                                        <span
                                            title={`Chuyển thành ${ticket.ticket.type === 'Vé cứng' ? 'Vé điện tử' : 'Vé cứng'}`}
                                            className={`min-w-[100px] text-center inline-block px-4 py-1 rounded-full text-xs font-semibold border 
                                                    ${ticket.ticket.type === 'Vé cứng'
                                                    ? 'bg-[#D3FFDA] text-[#51DA68] border-[#32E14F]'
                                                    : 'bg-teal-100 text-teal-500 border-teal-500'}`}>
                                            {ticket.ticket.type}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={9} className="text-center py-4 text-gray-500">
                                    Không có tài khoản nào khớp với từ khóa tìm kiếm
                                </td>
                            </tr>
                        )
                        }
                    </tbody>
                </table>
            </div>

            {/* Phân trang */}
            <Pagination
                currentPage={currentPage}
                totalItems={filteredTickets.length}
                itemsPerPage={itemsPerPage}
                onPrevious={handlePrevious}
                onNext={handleNext} />
        </>
    )
}