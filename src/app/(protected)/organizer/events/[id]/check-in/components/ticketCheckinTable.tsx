'use client'

/* Package System */
import { useState, useEffect } from "react";

/* Package Application */
import { TicketCheckin, TicketCheckinTableProps } from "../lib/interface/check-in.interface";
import Pagination from "./common/pagination";
import { sortUsers } from "@/app/(protected)/admin/account-management/libs/function/sortUsers";
import SortIcon from "@/app/(protected)/admin/account-management/_components/sortIcon";
import { CheckedInTicketDto } from "@/types/models/org/checkin.interface";
import { getAllCheckedInTickets } from "@/services/org.service";

export default function TicketCheckinTable({ activeTab, searchKeyword, showingId }: TicketCheckinTableProps) {
    //Gán cứng
   const [tickets, setTickets] = useState<CheckedInTicketDto[]>([])
  const [sortConfig, setSortConfig] = useState<{ key: keyof CheckedInTicketDto; direction: 'asc' | 'desc' } | null>(null)

  useEffect(() => {
    if (!showingId) return;

    const fetchData = async () => {
      try {
        const result = await getAllCheckedInTickets(showingId)
        setTickets(result)
      } catch (err) {
        console.error("Failed to load checked-in tickets:", err)
        setTickets([])
      }
    }

    fetchData()
  }, [showingId])

    const handleSort = (key: keyof CheckedInTicketDto) => {
    setSortConfig((prev) =>
      prev?.key === key
        ? { key, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" }
    )
  }

  const filteredTickets = tickets.filter(ticket => {
    const matchSearch = ticket.order_id.toLowerCase().includes(searchKeyword.toLowerCase())

    let matchTab = false
    switch (activeTab) {
      case "all":
        matchTab = true
        break
      case "e-ticket":
        matchTab = ticket.deliveryType === "E_TICKET"
        break
      case "ticket":
        matchTab = ticket.deliveryType === "PHYSICAL_TICKET"
        break
      default:
        matchTab = true
    }

    return matchSearch && matchTab
  })


     // Pagination
  const itemsPerPage = 10
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    setCurrentPage(1)
  }, [activeTab])

    const totalItems = filteredTickets.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startItem = (currentPage - 1) * itemsPerPage
  const endItem = Math.min(startItem + itemsPerPage, totalItems)

  const handlePrevious = () => currentPage > 1 && setCurrentPage(currentPage - 1)
  const handleNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1)

  const sortedTickets = sortUsers(filteredTickets, sortConfig)
  const paginatedData = sortedTickets.slice(startItem, endItem)

    return (
        <>
            <div className="table-account-management overflow-x-auto rounded-xl shadow-md mt-6">
                <table className="min-w-full border border-gray-200">
                    <thead>
                        <tr className="bg-[#0C4762] text-white text-sm text-left rounded-t-lg">
                            <th className="px-4 py-3 text-center">STT</th>
                           <th className="px-4 py-3 text-center cursor-pointer" onClick={() => handleSort('order_id')}>
                Mã đơn hàng <SortIcon field="order_id" sortConfig={sortConfig} />
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
                                     <td className="px-4 py-3 text-center border-r">{index + 1 + startItem}</td>
                    <td className="px-4 py-3 text-center border-r">{ticket.order_id}</td>
                    <td className="px-4 py-3 text-center border-r">{ticket.ticket_id}</td>
                    <td className="px-4 py-3 text-center border-r">{ticket.startTime.toLocaleString()}</td>
                    <td className="px-4 py-3 text-center border-r">
                      {ticket.startTime.toLocaleString("vi-VN", { hour: '2-digit', minute: '2-digit' })} - {ticket.endTime.toLocaleString("vi-VN", { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-4 py-3 text-center border-r">{ticket.venue}</td>
                    <td className="px-4 py-3 text-center border-r">
                      <span
                        className={`inline-block px-4 py-1 rounded-full text-xs font-semibold border ${
                          ticket.deliveryType === "PHYSICAL_TICKET"
                            ? "bg-[#D3FFDA] text-[#51DA68] border-[#32E14F]"
                            : "bg-teal-100 text-teal-500 border-teal-500"
                        }`}
                      >
                        {ticket.deliveryType === "PHYSICAL_TICKET" ? "Vé cứng" : "Vé điện tử"}
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