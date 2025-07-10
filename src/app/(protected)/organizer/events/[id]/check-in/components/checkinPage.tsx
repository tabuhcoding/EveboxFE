'use client'

import { useEffect, useState } from 'react'
import { FaSync } from 'react-icons/fa'
import SidebarOrganizer from '../../_components/sidebarOrganizer'
import CheckinStats from './checkinStats'
import TicketCheckinTable from './ticketCheckinTable'
import Tabs from './common/tab'
import SearchBar from './common/searchBar'
import SelectShowtimeModal from './selectShowtimeModal'
import { getShowingsByEventId } from '@/services/org.service'
import { useTranslations } from 'next-intl'

interface CheckinPageProps {
  eventId: number
}

export default function CheckinPage({ eventId }: CheckinPageProps) {
  const t = useTranslations('common')
  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key)
    return msg.startsWith('common.') ? fallback : msg
  }

  const [activeTab, setActiveTab] = useState("all")
  const [searchKeyword, setSearchKeyword] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedShow, setSelectedShow] = useState({ id: "", date: "", time: "" })

  useEffect(() => {
    if (!eventId) return
    const fetchShowings = async () => {
      const data = await getShowingsByEventId(eventId)
      const start = new Date(data[0]?.startTime || "")
      const end = new Date(data[0]?.endTime || "")
      const formattedTime = `${start.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })} - ${end.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}`
      setSelectedShow({ id: data[0]?.id, date: start.toISOString().slice(0, 10), time: formattedTime })
    }
    fetchShowings()
  }, [eventId])

  const handleShowtimeConfirm = (id: string, date: string, time: string) => {
    setSelectedShow({ id, date, time })
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-64 bg-gray-900 text-white">
        <SidebarOrganizer />
      </div>
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold text-[#0C4762]">{transWithFallback("checkin", "Check-in")}</h1>
        <p className="text-sm text-[#51DACF] pt-2">{selectedShow.date}, {selectedShow.time}</p>
        <div className="border-t-2 border-[#0C4762] mt-2" />

        <div className="flex justify-between items-center mt-6 mb-2">
          <button
            className="flex items-center gap-1 border border-[#0C4762] px-4 py-1 rounded-full text-[#0C4762] hover:bg-[#e6f7fa]"
            onClick={() => setShowModal(true)}
          >
            {transWithFallback("changeShow", "Đổi suất diễn")} <FaSync />
          </button>
        </div>

        <h3 className="text-lg font-bold text-[#0C4762] mb-2 mt-6">{transWithFallback("overview", "Tổng quan")}</h3>
        <CheckinStats showingId={selectedShow.id} />

        <h3 className="text-lg font-bold text-[#0C4762] mb-2 mt-6">{transWithFallback("ticketDetails", "Chi tiết")}</h3>
        <div className="flex justify-between items-center mt-2 mb-2">
          <SearchBar onSearch={setSearchKeyword} />
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        <TicketCheckinTable
          activeTab={activeTab}
          searchKeyword={searchKeyword}
          showingId={selectedShow.id}
        />

        <SelectShowtimeModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={handleShowtimeConfirm}
          selectedShow={selectedShow}
          setSelectedShow={setSelectedShow}
          eventId={eventId}
        />
      </div>
    </div>
  )
}
