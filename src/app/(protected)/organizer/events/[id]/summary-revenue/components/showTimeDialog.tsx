"use client"

import { useState } from "react"
import { X, Check } from "lucide-react"
import { IShowTime } from "@/types/models/org/orgEvent.interface"

interface ShowTimesPopupProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (selectedShowTime: IShowTime) => void
  showTimes: IShowTime[]
}

export const ShowTimesPopup = ({ isOpen, onClose, onConfirm, showTimes }: ShowTimesPopupProps) => {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  if (!isOpen) return null

  const handleConfirm = () => {
    const selectedShowTime = showTimes.find(st => st.id === selectedId)
    if (selectedShowTime) {
      onConfirm(selectedShowTime)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white text-black rounded-lg w-full max-w-md overflow-hidden">

        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-medium text-[#0C4762]">Danh sách suất diễn</h2>
          <button onClick={onClose} className="text-black hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[300px] overflow-y-auto p-4">
          {showTimes.length === 0 ? (
            <div className="text-center text-gray-500">Không có suất diễn nào</div>
          ) : (
            showTimes.map((showTime) => (
              <div
                key={showTime.id}
                onClick={() => setSelectedId(showTime.id)}
                className={`flex items-center justify-between p-2 mb-2 border rounded-lg cursor-pointer ${selectedId === showTime.id ? "bg-[#E0F7FA] border-[#00BCD4]" : "hover:bg-gray-100"
                  }`}
              >
                <div>
                  <div className="text-sm text-gray-500">{new Date(showTime.startTime).toLocaleString("vi-VN")}</div>
                </div>
                {selectedId === showTime.id && <Check size={20} className="text-[#00BCD4]" />}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-4 p-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-black"
          >
            Huỷ
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-[#0C4762] text-white rounded hover:bg-[#093752]"
            disabled={!selectedId}
          >
            Xác nhận
          </button>
        </div>

      </div>
    </div>
  )
}



