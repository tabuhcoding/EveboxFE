"use client"

import "tailwindcss/tailwind.css"

import { useState, useEffect } from "react"
import { DropdownWrapper } from "./dropdown"
import SidebarOrganizer from "../../components/sidebarOrganizer"
import OrderTabs from "./ordersTab"
import { getOrdersByShowingId, getShowingsByEventId } from "@/services/organizer.service"
import type { TicketOrderData } from "@/types/model/getOrdersOrg"
import type { IShowTime } from "@/types/model/getSummaryOrg"

interface OrdersPageProps {
  eventId: number
}

export function OrdersPage({ eventId }: OrdersPageProps) {
  // State variables
  const [showingId, setShowingId] = useState<string>("")
  const [showings, setShowings] = useState<IShowTime[]>([])
  const [ordersData, setOrdersData] = useState<TicketOrderData[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Step 1: Fetch showings when eventId changes
  useEffect(() => {
    const fetchShowings = async () => {
      try {
        setLoading(true)
        const showingsData = await getShowingsByEventId(eventId)

        console.log("Showings data:", showingsData)

        if (showingsData && showingsData.length > 0) {
          setShowings(showingsData)
          // Select the showing marked as selected or default to the first one
          const selectedShowing = showingsData.find((show: IShowTime) => show.isSelected) || showingsData[0]
          setShowingId(selectedShowing.id)
        } else {
          setError("Không tìm thấy suất diễn nào")
        }
      } catch (error) {
        console.error("Error fetching showings:", error)
        setError("Không thể tải thông tin suất diễn")
      } finally {
        setLoading(false)
      }
    }

    if (eventId) {
      fetchShowings()
    }
  }, [eventId])

  // Step 2: Fetch orders when showingId changes
  useEffect(() => {
    const fetchOrders = async () => {
      if (!showingId) return

      try {
        setLoading(true)
        const response = await getOrdersByShowingId(showingId)
        console.log("Orders API response:", response)

        // Check if response is an array directly
        if (Array.isArray(response)) {
          setOrdersData(response)
          console.log("Setting orders data:", response)
        }
        // Also check for response.data as fallback
        else if (response && response.data) {
          setOrdersData(response.data)
          console.log("Setting orders data from response.data:", response.data)
        } else {
          setOrdersData([])
          console.log("No orders data found, setting empty array")
        }
      } catch (error) {
        console.error("Error fetching orders:", error)
        setError("Không thể tải dữ liệu đơn hàng")
        setOrdersData([])
      } finally {
        setLoading(false)
      }
    }

    if (showingId) {
      fetchOrders()
    }
  }, [showingId])

  // Function to handle showing selection from dropdown
  const handleShowingSelect = (id: string) => {
    console.log("Selected showing ID:", id)
    setShowingId(id)
  }

  return (
    <main>
      <div className="flex min-h-screen bg-gray-100">
        <div className="w-64 bg-gray-900 text-white">
          <SidebarOrganizer />
        </div>
        <div className="flex-1 p-6">
          <h1 className="text-2xl font-bold text-[#0C4762]">LiveShow ca nhạc</h1>
          <div className="border-t-2 border-[#0C4762] mt-2"></div>
          <div className="py-6 flex items-center space-x-6">
            <h3 className="text-lg font-bold text-[#0C4762] mb-2">Danh sách buổi biểu diễn</h3>
            <DropdownWrapper showings={showings} onShowingSelect={handleShowingSelect} />
          </div>

          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0C4762]"></div>
            </div>
          ) : (
            <OrderTabs ordersData={ordersData} />
          )}
        </div>
      </div>
    </main>
  )
}
