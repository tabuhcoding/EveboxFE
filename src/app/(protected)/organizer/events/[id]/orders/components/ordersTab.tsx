"use client"

import { useState, useEffect } from "react"
import type { TicketOrderData } from "@/types/model/getOrdersOrg"

import OrderSection from "./orderSection"
import TicketSection from "./TicketSection"

export default function OrderTabs({ ordersData = [] }: { ordersData?: TicketOrderData[] }) {
  const [activeTab, setActiveTab] = useState("orders")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Debug log to check the data
  useEffect(() => {
    console.log("OrderTabs received data:", ordersData)
  }, [ordersData])

  // Make sure we're working with an array, even if ordersData is undefined
  const safeOrdersData = Array.isArray(ordersData) ? ordersData : []

  if (!mounted) return null // Avoid hydration errors

  return (
    <div className="w-full flex flex-col items-center">
      {/* Tabs Bar */}
      <div className="w-full flex bg-gray-200 rounded-lg overflow-hidden">
        <button
          className={`flex-1 py-1 text-center text-lg font-medium transition-all duration-300
                        ${activeTab === "orders" ? "bg-[#0C4762] text-white" : "bg-gray-200 text-[#0C4762]"}`}
          onClick={() => setActiveTab("orders")}
        >
          Đơn hàng
        </button>
        <button
          className={`flex-1 py-1 text-center text-lg font-medium transition-all duration-300
                        ${activeTab === "tickets" ? "bg-[#0C4762] text-white" : "bg-gray-200 text-[#0C4762]"}`}
          onClick={() => setActiveTab("tickets")}
        >
          Vé
        </button>
      </div>

      {/* Tab Content */}
      <div className="w-full mt-4">
        {activeTab === "orders" ? (
          <OrderSection ordersData={safeOrdersData} />
        ) : (
          <TicketSection ordersData={safeOrdersData} />
        )}
      </div>
    </div>
  )
}

