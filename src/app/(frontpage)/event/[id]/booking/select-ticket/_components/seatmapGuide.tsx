"use client";

/* Package System */
import { useTranslations } from "next-intl"
import { MousePointer, Move, ZoomIn, ZoomOut } from "lucide-react"

interface SeatmapGuideProps {
  className?: string
}

export default function SeatmapGuide({ className = "" }: SeatmapGuideProps) {
  const t = useTranslations("common");

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    if (!msg || msg.startsWith("common.")) return fallback;
    return msg;
  }

  return (
    <div className={`seatmap-guide bg-gray-50 p-4 rounded-lg border ${className}`}>
      <h3 className="font-bold text-base mb-3 text-gray-800">
        {transWithFallback("seatmapGuide", "Hướng dẫn sử dụng")}
      </h3>

      <div className="space-y-3 text-sm">
        {/* Zoom In/Out */}
        <div className="flex items-start gap-2">
          <div className="flex items-center gap-1 min-w-0">
            <ZoomIn className="h-4 w-4 text-blue-600 flex-shrink-0" />
            <ZoomOut className="h-4 w-4 text-blue-600 flex-shrink-0" />
          </div>
          <div className="text-gray-700">
            <div className="font-medium">{transWithFallback("zoomInOut", "Phóng to/thu nhỏ")}: <span className="text-xs text-gray-600">{transWithFallback("scrollToZoom", "Cuộn chuột hoặc touchpad")}</span></div>
          </div>
        </div>

        {/* Move/Drag */}
        <div className="flex items-start gap-2">
          <Move className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="text-gray-700">
            <div className="font-medium">{transWithFallback("moveSeatmap", "Di chuyển sơ đồ")}: <span className="text-xs text-gray-600">{transWithFallback("clickAndDrag", "Nhấn giữ chuột và kéo")}</span></div>
          </div>
        </div>

        {/* Select Seat */}
        <div className="flex items-start gap-2">
          <MousePointer className="h-4 w-4 text-purple-600 flex-shrink-0 mt-0.5" />
          <div className="text-gray-700">
            <div className="font-medium">{transWithFallback("selectSeat", "Chọn ghế/khu vực")}: <span className="text-xs text-gray-600">{transWithFallback("clickToSelect", "Nhấp chuột để chọn")}</span></div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          <span className="font-medium">{transWithFallback("tip", "Mẹo")}:</span>{" "}
          {transWithFallback("zoomTip", "Phóng to để xem rõ hơn số ghế và vị trí")}
        </div>
      </div>
    </div>
  )
}