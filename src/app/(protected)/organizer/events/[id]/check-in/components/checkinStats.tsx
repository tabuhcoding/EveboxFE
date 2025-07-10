'use client'

import { useEffect, useState } from 'react'
import { FaCheckCircle } from 'react-icons/fa'
import { useTranslations } from 'next-intl'
import { getAllCheckedInTickets } from '@/services/org.service'
import { CheckedInTicketDto } from '@/types/models/org/checkin.interface'

interface CheckinStatsProps {
  showingId: string
}

export default function CheckinStats({ showingId }: CheckinStatsProps) {
  const t = useTranslations("common")
  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key)
    return msg.startsWith("common.") ? fallback : msg
  }

  const [checkedInTickets, setCheckedInTickets] = useState<CheckedInTicketDto[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!showingId) return
    const fetchData = async () => {
      setLoading(true)
      try {
        const result = await getAllCheckedInTickets(showingId)
        setCheckedInTickets(result)
      } catch (err) {
        setError(transWithFallback("checkinError", "Không thể tải dữ liệu check-in"))
        setCheckedInTickets([])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [showingId])

  const totalCheckedIn = checkedInTickets.length
  const uniqueOrders = new Set(checkedInTickets.map(ticket => ticket.order_id)).size

  return (
    <div className="flex">
      <div className="flex-1 bg-[#0C4762] text-white p-6 rounded-xl flex items-center">
        <div className="flex items-center gap-4 justify-start">
          <FaCheckCircle className="w-16 h-16 text-[#51DACF] text-5xl" />
          <div>
            <p className="text-sm">{transWithFallback("checkedIn", "Đã check-in")}</p>
            <p className="text-2xl font-bold">{loading ? "..." :  `${totalCheckedIn} ${transWithFallback("tickets", "Đã check-in")}`}</p>
            <p className="text-sm">{loading ? "..." : `${transWithFallback("sold", "Đã check-in")} ${uniqueOrders} ${transWithFallback("orders", "Đã check-in")}`}</p>
            {error && <p className="text-sm text-red-300">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
