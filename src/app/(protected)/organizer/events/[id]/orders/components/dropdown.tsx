"use client"

import { useState, useEffect } from "react"
import type { IShowTime, IFormattedShowingData } from "@/types/model/getSummaryOrg"

// Basic dropdown component
export default function Dropdown({
  options,
  selected,
  onChange,
  labelKey,
  valueKey,
}: {
  options: IFormattedShowingData[]
  selected: string
  onChange: (value: string) => void
  labelKey?: string
  valueKey?: string
}) {
  return (
    <select
      className="border border-[#0C4762] text-[#0C4762] rounded-lg px-4 py-1"
      value={selected}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((option) => {
        const value = valueKey ? option[valueKey as keyof IFormattedShowingData] : option
        const label = labelKey ? option[labelKey as keyof IFormattedShowingData] : option
        return (
          <option key={String(value)} value={String(value)}>
            {String(label)}
          </option>
        )
      })}
    </select>
  )
}

// Component Wrapper to use in page.tsx
export function DropdownWrapper({
  showings = [],
  onShowingSelect,
}: {
  showings?: IShowTime[]
  onShowingSelect?: (showingId: string) => void
}) {
  const [selectedShowing, setSelectedShowing] = useState<string>("")
  const [formattedShowings, setFormattedShowings] = useState<Array<IShowTime & { formattedLabel: string }>>([])

  // Process showings data when it changes
  useEffect(() => {
    if (!showings || showings.length === 0) return

    const formatted = showings.map((showing) => {
      const startDate = new Date(showing.startTime)
      const endDate = new Date(showing.endTime)

      const dateStr = startDate.toLocaleDateString("vi-VN")

      const startTimeStr = `${startDate.getHours().toString().padStart(2, "0")}:${startDate.getMinutes().toString().padStart(2, "0")}`
      const endTimeStr = `${endDate.getHours().toString().padStart(2, "0")}:${endDate.getMinutes().toString().padStart(2, "0")}`

      // Create formatted label
      const formattedLabel = `${dateStr} (${startTimeStr} - ${endTimeStr})`

      return {
        ...showing,
        formattedLabel,
      }
    })

    setFormattedShowings(formatted)

    if (formatted.length > 0) {
      const defaultShowing = formatted.find((s) => s.isSelected) || formatted[0]
      setSelectedShowing(defaultShowing.id)
      if (onShowingSelect) {
        onShowingSelect(defaultShowing.id)
      }
    }
  }, [showings, onShowingSelect])

  const handleShowingChange = (showingId: string) => {
    setSelectedShowing(showingId)
    if (onShowingSelect) {
      onShowingSelect(showingId)
    }
  }

  if (!showings || showings.length === 0) {
    return <div className="text-gray-500">Không có dữ liệu suất diễn</div>
  }

  return (
    <div>
      <Dropdown
        options={formattedShowings}
        selected={selectedShowing}
        onChange={handleShowingChange}
        valueKey="id"
        labelKey="formattedLabel"
      />
    </div>
  )
}
