"use client"

import { useState, useEffect } from "react"
import { RotateCcw } from "lucide-react"
import { ShowTimesPopup } from "./showTimeDialog"
import { getShowingsByEventId } from "@/services/org.service"
import type { IShowTime } from "@/types/models/org/orgEvent.interface"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { useTranslations } from "next-intl"

interface SummaryControlsProps {
  eventTitle: string
  eventId: number
  startTime?: string | Date
  endTime?: string | Date
  onShowingChange?: (showingId: string) => void
}

export const SummaryControls = ({ eventTitle, eventId, startTime, endTime, onShowingChange }: SummaryControlsProps) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [showTimes, setShowTimes] = useState<IShowTime[]>([])
  const [, setLoadingShowTimes] = useState(false)

   const t = useTranslations("common");
      const transWithFallback = (key: string, fallback: string) => {
        const msg = t(key);
        return msg.startsWith("common.") ? fallback : msg;
      };

  const formatDateTime = (dateTime?: string | Date) => {
    if (!dateTime) return ""
    try {
      const date = new Date(dateTime)
      return format(date, "dd MMMM yyyy, HH:mm", { locale: vi })
    } catch (error) {
      console.error("Error formatting date:", error)
      return String(dateTime)
    }
  }

  const fetchShowTimes = async () => {
    try {
      setLoadingShowTimes(true)
      const res = await getShowingsByEventId(eventId)
      setShowTimes(res || [])
    } catch (error) {
      console.error("Failed to fetch showtimes:", error)
    } finally {
      setLoadingShowTimes(false)
    }
  }

  const handleShowTimeChange = (selectedShowTime: IShowTime) => {
    if (onShowingChange) {
      onShowingChange(selectedShowTime.id)
    }
  }

  useEffect(() => {
    if (isPopupOpen) {
      fetchShowTimes()
    }
  }, [isPopupOpen])

  return (
    <div className="mb-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#0C4762]">{eventTitle}</h1>
          {startTime && endTime && (
            <p className="text-sm text-[#51DACF] pt-1">
              {formatDateTime(startTime)} - {formatDateTime(endTime)}
            </p>
          )}
        </div>

        <button
          onClick={() => setIsPopupOpen(true)}
          className="flex items-center gap-2 bg-[#0C4762] text-white px-4 py-2 rounded-lg hover:bg-[#09374e]"
        >
          <RotateCcw size={20} />
          {transWithFallback("selectShowing", "Chọn suất diễn")} 
        </button>
      </div>

      <div className="border-t-2 border-[#0C4762] mt-2"></div>

      {/* Popup */}
      <ShowTimesPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onConfirm={handleShowTimeChange}
        showTimes={showTimes}
      />
    </div>
  )
}


