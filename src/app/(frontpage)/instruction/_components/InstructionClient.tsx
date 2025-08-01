"use client"

/* Package System */
import { useRef, useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { useRouter, useSearchParams } from "next/navigation"

/* Package Application */
import CardButton from "./CardButton"
import UserInstruction from "./UserInstruction"

export default function InstructionClient() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get initial values from URL params
  const initialTab = (searchParams.get("tab") as "user" | "organizer") || "user"
  const initialActiveDetail = searchParams.get("activeTab") || null

  const [tab, setTab] = useState<"user" | "organizer">(initialTab)
  const [activeDetail, setActiveDetail] = useState<string | null>(initialActiveDetail)
  const t = useTranslations("common")

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key)
    return !msg || msg.startsWith("common.") ? fallback : msg
  }

  const [leftWidth, setLeftWidth] = useState(320) // Initial width in px
  const isDragging = useRef(false)

  // Update URL when tab or activeDetail changes
  const updateURL = (newTab: "user" | "organizer", newActiveDetail: string | null) => {
    const params = new URLSearchParams()
    params.set("tab", newTab)
    if (newActiveDetail) {
      params.set("activeTab", newActiveDetail)
    }

    const newURL = `/instruction?${params.toString()}`
    router.push(newURL, { scroll: false })
  }

  // Handle tab change
  const handleTabChange = (newTab: "user" | "organizer") => {
    setTab(newTab)
    setActiveDetail(null)
    updateURL(newTab, null)
  }

  // Handle active detail change
  const handleActiveDetailChange = (detail: string) => {
    setActiveDetail(detail)
    updateURL(tab, detail)
  }

  // Sync state with URL params on mount and when searchParams change
  useEffect(() => {
    const urlTab = (searchParams.get("tab") as "user" | "organizer") || "user"
    const urlActiveDetail = searchParams.get("activeTab") || null

    setTab(urlTab)
    setActiveDetail(urlActiveDetail)
  }, [searchParams])

  const handleMouseDown = () => {
    isDragging.current = true
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current) return
    const newWidth = Math.min(Math.max(e.clientX, 200), 600) // min 200, max 600
    setLeftWidth(newWidth)
  }

  const handleMouseUp = () => {
    isDragging.current = false
  }

  // Attach global mouse events
  if (typeof window !== "undefined") {
    window.onmousemove = handleMouseMove
    window.onmouseup = handleMouseUp
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {transWithFallback("instructionManual", "Hướng Dẫn Sử Dụng")}
      </h1>

      {/* Tabs */}
      <div className="flex justify-center mb-6 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => handleTabChange("user")}
          className={`px-4 py-2 font-medium rounded-md transition-colors ${tab === "user" ? "bg-sky-800 text-white shadow" : "text-sky-700 hover:bg-sky-100"
            }`}
        >
          {transWithFallback("instructForUser", "Hướng dẫn cho Người dùng")}
        </button>
        <button
          onClick={() => handleTabChange("organizer")}
          className={`ml-2 px-4 py-2 font-medium rounded-md transition-colors ${tab === "organizer" ? "bg-sky-800 text-white shadow" : "text-sky-700 hover:bg-sky-100"
            }`}
        >
          {transWithFallback("instructForOrg", "Hướng dẫn cho Nhà tổ chức")}
        </button>
      </div>

      {/* Two Column Layout */}
      <div className="flex w-full min-h-[400px]">
        {/* Left Column - Expanders */}
        <div style={{ width: leftWidth }} className="border-r border-gray-300 bg-gray-50 p-4 overflow-y-auto">
          {tab === "user" && (
            <>
              <details className="border rounded-md p-4">
                <summary className="font-semibold cursor-pointer text-sky-900">
                  {transWithFallback("accountManagement", "Quản lý tài khoản")}
                </summary>
                <div className="mt-3 space-y-2 ml-4">
                  <CardButton
                    label={transWithFallback("register", "Đăng ký")}
                    onClick={() => handleActiveDetailChange("sign-up")}
                  />
                  <CardButton
                    label={transWithFallback("login", "Đăng nhập")}
                    onClick={() => handleActiveDetailChange("sign-in")}
                  />
                  <CardButton
                    label={transWithFallback("updateProfileAndPass", "Cập nhật thông tin và mật khẩu")}
                    onClick={() => handleActiveDetailChange("update-profile")}
                  />
                </div>
              </details>
              <details className="border rounded-md p-4">
                <summary className="font-semibold cursor-pointer text-sky-900">
                  {transWithFallback("interactAndExploreEvents", "Tương tác và Khám phá sự kiện")}
                </summary>
                <div className="mt-3 space-y-2 ml-4">
                  <CardButton
                    label={transWithFallback("wayToSearchEvent", "Cách tìm kiếm sự kiện")}
                    onClick={() => handleActiveDetailChange("search-event")}
                  />
                  <CardButton
                    label={transWithFallback("followEvent", "Theo dõi sự kiện")}
                    onClick={() => handleActiveDetailChange("follow-event")}
                  />
                </div>
              </details>
              <details className="border rounded-md p-4">
                <summary className="font-semibold cursor-pointer text-sky-900">
                  {transWithFallback("buyAndManageTicket", "Mua vé và Quản lý vé")}
                </summary>
                <div className="mt-3 space-y-2 ml-4">
                  <CardButton
                    label={transWithFallback("buyTicketProcess", "Quy trình mua vé")}
                    onClick={() => handleActiveDetailChange("buy-ticket")}
                  />
                  <CardButton
                    label={transWithFallback("checkTicketAndQR", "Xem vé và Mã QR (ứng dụng di động)")}
                    onClick={() => handleActiveDetailChange("view-qr")}
                  />
                </div>
              </details>
            </>
          )}

          {tab === "organizer" && (
            <>
              <details className="border rounded-md p-4">
                <summary className="font-semibold cursor-pointer text-sky-900">
                  {transWithFallback("createAndManageEvent", "Tạo và Quản lý sự kiện")}
                </summary>
                <div className="mt-3 space-y-2 ml-4">
                  <CardButton
                    label={transWithFallback("creatEventProcess", "Quy trình tạo mới sự kiện")}
                    onClick={() => handleActiveDetailChange("create-event")}
                  />
                  <CardButton
                    label={transWithFallback("manageForOrg", "Quản lý cho organizer")}
                    onClick={() => handleActiveDetailChange("org-management")}
                  />
                  <CardButton
                    label={transWithFallback("orgCheckin", "Checkin QR code")}
                    onClick={() => handleActiveDetailChange("org-checkin")}
                  />
                </div>
              </details>
              <div className="border rounded-md p-4 bg-gray-50">
                <button
                  className="text-sky-900 hover:underline font-medium bg-white-900 text-left w-full"
                  onClick={() => handleActiveDetailChange("organizer-analytics")}
                >
                  {transWithFallback("operationAndStatistics", "Vận hành và Thống kê")}
                </button>
              </div>
            </>
          )}
        </div>

        <div
          onMouseDown={handleMouseDown}
          className="w-1 cursor-col-resize bg-sky-900 hover:bg-sky-600 transition-colors"
        />

        {/* Right Column - Detail Viewer */}
        <UserInstruction activeDetail={activeDetail ? activeDetail : ""} />
      </div>
    </div>
  )
}
