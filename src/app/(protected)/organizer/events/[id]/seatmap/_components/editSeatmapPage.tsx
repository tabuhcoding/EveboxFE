"use client"

/* Package System */
import { useState, useEffect } from "react"
import { ChevronDown } from "lucide-react"
import { useTranslations } from "next-intl"
import toast from "react-hot-toast"

/* Package Application */
import { useAuth } from "@/contexts/auth.context"
import SidebarOrganizer from "../../_components/sidebarOrganizer"
import {
  SeatMap,
  TicketType,
  SeatmapType,
} from "@/types/models/event/booking/seatmap.interface"
import SeatMapComponent from "./seatmapComponent"
import SeatMapSectionComponent from "./seatmapSectionComponent"
import { getSeatMap, getShowingsOfEvent, connectShowingToSeatmap } from "@/services/event.service"

interface SeatMapPageProps {
  eventId: number
}

export const SeatMapPage = ({ eventId }: SeatMapPageProps) => {
  const t = useTranslations("common");
  const { session } = useAuth();

  // State for dropdown and selection
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  // State for seat map data
  const [seatMaps, setSeatMaps] = useState<SeatMap[]>([]);
  const [selectedSeatMapId, setSelectedSeatMapId] = useState<number>(0);
  const [seatMapData, setSeatMapData] = useState<SeatMap | null>(null);
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [seatmapType, setSeatmapType] = useState<SeatmapType>(SeatmapType.NOT_A_SEATMAP);

  // Thêm các state này sau các state hiện có
  const [selectedTicketTypeId, setSelectedTicketTypeId] = useState<string>("")
  const [ticketTypeSectionMap, setTicketTypeSectionMap] = useState<{ [ticketTypeId: string]: number[] }>({})
  const [sections, setSections] = useState<any[]>([])
  const [isLoadingMapping, setIsLoadingMapping] = useState<boolean>(false);

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    if (!msg || msg.startsWith('common.')) return fallback;
    return msg;
  };

  // Fetch showings and seatmaps on component mount
  useEffect(() => {
    const fetchShowingsAndSeatMaps = async () => {
      try {
        setIsLoading(true)

        const response = await getShowingsOfEvent(eventId, session?.user?.accessToken || "");

        if (response?.statusCode === 200) {
          const showings = response.data;

          const seatMapPromises = showings
            .filter((showing) => showing.seatMapId > 0)
            .map(async (showing) => {
              try {
                const seatMapResponse = await getSeatMap(showing.id)
                if (seatMapResponse?.data) {
                  return {
                    ...seatMapResponse.data,
                    showingId: showing.id,
                    ticketTypes: showing.TicketType,
                  }
                }
              } catch (error) {
                console.error(`Error fetching seatmap for showing ${showing.id}:`, error)
                return null
              }
            });
          const seatMapsResults = await Promise.all(seatMapPromises)
          const validSeatMaps = seatMapsResults
            .filter(Boolean)
            .map((seatMap: any) => ({
              ...seatMap,
              ticketTypes: seatMap.ticketTypes.map((tt: any) => ({
                ...tt,
                effectiveFrom: tt.effectiveFrom ?? tt.startTime ?? "",
                effectiveTo: tt.effectiveTo ?? tt.endTime ?? "",
              })),
            })) as (SeatMap & {
              showingId: string
              ticketTypes: TicketType[]
            })[]

          setSeatMaps(validSeatMaps)

          if (validSeatMaps.length > 0) {
            setSelectedSeatMapId(Number(validSeatMaps[0].id))
          } else {
            setError(transWithFallback("notFoundSeatmap", "Không tìm thấy sơ đồ chỗ ngồi nào"))
          }
        }
      } catch (error) {
        console.error("Error fetching seatmaps:", error)
        setError(transWithFallback("errorFoundSeatmap", "Lỗi khi tải sơ đồ chỗ ngồi"))
      } finally {
        setIsLoading(false)
      }
    }

    if (eventId) {
      fetchShowingsAndSeatMaps()
    }
  }, [eventId])

  // Handle seatmap selection
  useEffect(() => {
    const handleSeatMapSelection = () => {
      if (!selectedSeatMapId) return

      const selectedSeatMap = seatMaps.find((sm) => sm.id === selectedSeatMapId)
      if (selectedSeatMap) {
        setSeatMapData(selectedSeatMap)
        setSeatmapType(selectedSeatMap.seatMapType || SeatmapType.NOT_A_SEATMAP)

        // Set ticket types from the seatmap's associated showing
        const sortedTicketTypes = [...(selectedSeatMap as any).ticketTypes].sort((a, b) => a.position - b.position)
        setTicketTypes(sortedTicketTypes)
      }
    }

    handleSeatMapSelection()
  }, [selectedSeatMapId, seatMaps])

  useEffect(() => {
    if (seatMapData?.Section) {
      const normalSections = seatMapData.Section.filter((s) => !s.isStage)
      setSections(normalSections)
    }
  }, [seatMapData])

  const handleSeatMapChange = (seatMapId: string | number) => {
    setSelectedSeatMapId(Number(seatMapId))
    setIsDropdownOpen(false)
  }

  const handleTicketTypeSelect = (ticketTypeId: string) => {
    setSelectedTicketTypeId(ticketTypeId === selectedTicketTypeId ? "" : ticketTypeId)
  }

  const handleAddTicketTypeToSection = (sectionId: number) => {
    if (!selectedTicketTypeId) return

    setTicketTypeSectionMap((prev) => {
      const current = prev[selectedTicketTypeId] || []
      if (current.includes(sectionId)) {
        // Remove if already exists
        return {
          ...prev,
          [selectedTicketTypeId.toString()]: current.filter((id) => id !== sectionId),
        }
      } else {
        // Add if not exists
        return {
          ...prev,
          [selectedTicketTypeId.toString()]: [...current, sectionId],
        }
      }
    })
  }

  const handleConfirmMapping = async () => {
    if (!seatMapData || Object.keys(ticketTypeSectionMap).length === 0) return

    try {
      setIsLoadingMapping(true);
      const payload = {
        showingId: (seatMaps.find((sm) => sm.id === selectedSeatMapId) as any)?.showingId || "",
        seatmapId: selectedSeatMapId,
        ticketTypeSectionMap,
      }

      const res = await connectShowingToSeatmap(payload, session?.user?.accessToken || "");

      if (res?.statusCode !== 200) {
        toast.error(`${transWithFallback('errorConnectShowingToSeatmap', 'Có lỗi khi kết nối suất diễn với sơ đồ chỗ ngồi')}: ${res.message}`);
      }
      else {
        toast.success(`${transWithFallback('connectSeatmap', 'Kết nối suất diễn với sơ đồ chỗ ngồi thành công')}`)
      }

      setTicketTypeSectionMap({})
      setSelectedTicketTypeId("")
    } catch (error) {
      toast.error(`${transWithFallback('errorConnectShowingToSeatmap', 'Có lỗi khi kết nối suất diễn với sơ đồ chỗ ngồi')}: ${error}`);
    } finally {
      setIsLoadingMapping(false);
    }
  }

  const isTicketTypeInSection = (ticketTypeId: string, sectionId: number) => {
    return ticketTypeSectionMap[ticketTypeId]?.includes(sectionId) || false
  }

  const selectedSeatMapName = seatMaps.find((seatMap) => seatMap.id === selectedSeatMapId)?.name || ""

  if (isLoading) {
    return (
      <div className="flex min-h-screen">
        <div className="inset-y-0 left-0 w-64 bg-gray-900 md:relative md:flex-shrink-0">
          <SidebarOrganizer />
        </div>
        <div className="flex-1 p-6 md-64 w-full flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0C4762] mx-auto"></div>
            <p className="mt-4 text-[#0C4762]">{transWithFallback("loadingData", "Đang tải dữ liệu...")}</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen">
        <div className="inset-y-0 left-0 w-64 bg-gray-900 md:relative md:flex-shrink-0">
          <SidebarOrganizer />
        </div>
        <div className="flex-1 p-6 md-64 w-full flex items-center justify-center">
          <div className="text-center text-red-500">
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-[#0C4762] text-white rounded-md hover:bg-[#0A3A50]"
            >
              {transWithFallback("retry", "Thử lại")}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="inset-y-0 left-0 w-64 bg-gray-900 md:relative md:flex-shrink-0">
        <SidebarOrganizer />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-100">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#0C4762] mb-2">{transWithFallback("seatmap", "Sơ đồ chỗ ngồi")}</h1>
          <div className="border-t-2 border-[#0C4762]"></div>
        </div>

        {/* Content Layout */}
        <div className="flex gap-6 h-[calc(100vh-140px)]">
          {/* Left Side - Seat Map */}
          <div className="flex-1 flex flex-col">
            {/* SeatMap Dropdown */}
            <div className="mb-4">
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full max-w-md bg-white border border-gray-300 rounded-lg px-4 py-3 text-left flex items-center justify-between hover:border-[#51DACF] transition-colors"
                >
                  <span className="text-gray-700">
                    {selectedSeatMapName || transWithFallback("selectSeatMap", "Chọn sơ đồ chỗ ngồi")}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-w-md">
                    {seatMaps.map((seatMap) => (
                      <button
                        key={seatMap.id}
                        onClick={() => handleSeatMapChange(seatMap.id)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors"
                      >
                        <div className="font-medium">{seatMap.name}</div>
                        <div className="text-sm text-gray-500">
                          {transWithFallback("seatMapType", "Loại")}: {seatMap.seatMapType}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Seat Map Display Area */}
            <div className="flex-1 bg-white rounded-lg border-2 border-gray-300 overflow-hidden">
              {seatmapType === SeatmapType.NOT_A_SEATMAP ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div className="text-4xl font-light mb-4">
                      {transWithFallback("notFoundSeatmap", "Không có sơ đồ chỗ ngồi")}
                    </div>
                    <p className="text-lg">{transWithFallback("regularTicketSale", "Sự kiện bán vé thường")}</p>
                  </div>
                </div>
              ) : seatmapType === SeatmapType.SELECT_SEAT && seatMapData ? (
                <div className="h-full overflow-hidden">
                  <SeatMapComponent
                    seatMap={seatMapData}
                    ticketType={ticketTypes}
                    selectedSeatIds={[]}
                    onSeatSelectionChange={() => { }} // Empty function to disable interaction
                  />
                </div>
              ) : seatmapType === SeatmapType.SELECT_SECTION && seatMapData ? (
                <div className="h-full overflow-hidden">
                  <SeatMapSectionComponent
                    seatMap={seatMapData}
                    ticketType={ticketTypes}
                    selectedTickets={{}}
                    onSeatSelectionChange={() => { }} // Empty function to disable interaction
                  />
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div className="text-4xl font-light mb-4">SEATMAP</div>
                    <p className="text-lg">{transWithFallback("loadingSeatMap", "Đang tải sơ đồ chỗ ngồi...")}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Controls */}
          <div className="w-80 bg-white rounded-lg border border-gray-300 p-6 overflow-y-auto max-h-[calc(100vh-140px)]">
            {/* Ticket Types */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-[#0C4762] mb-4">
                {transWithFallback("ticketType", "Loại vé")}
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 border">
                {ticketTypes.length > 0 ? (
                  ticketTypes.map((ticketType) => (
                    <button
                      key={ticketType.id}
                      onClick={() => handleTicketTypeSelect(ticketType.id)}
                      className={`w-full flex items-center justify-between py-2 px-3 mb-2 rounded-lg border transition-colors ${selectedTicketTypeId === ticketType.id
                        ? "bg-[#0C4762] text-white border-[#0C4762]"
                        : "bg-white hover:bg-gray-100 border-gray-200"
                        }`}
                    >
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: ticketType.color }}></div>
                        <span className="text-sm font-medium">{ticketType.name}</span>
                      </div>
                      <span className="text-sm">{ticketType.originalPrice.toLocaleString("vi-VN")}đ</span>
                    </button>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">{transWithFallback("noTicketTypes", "Chưa có loại vé")}</p>
                )}
              </div>
            </div>

            {/* Sections */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-[#0C4762] mb-4">{transWithFallback("section", "Khu vực")}</h3>
              <div className="bg-gray-50 rounded-lg p-4 border max-h-60 overflow-y-auto">
                {sections.length > 0 ? (
                  sections.map((section) => (
                    <div
                      key={section.id}
                      className="flex items-center justify-between py-2 px-2 mb-2 bg-white rounded border"
                    >
                      <div className="flex-1 min-w-0 mr-2">
                        <span className="text-sm font-medium break-words">{section.name}</span>
                        {ticketTypeSectionMap &&
                          Object.entries(ticketTypeSectionMap).map(
                            ([ttId, sectionIds]) =>
                              sectionIds.includes(section.id) && (
                                <div key={ttId} className="text-xs text-gray-600 mt-1 truncate">
                                  {ticketTypes.find((tt) => tt.id === ttId)?.name}
                                </div>
                              )
                          )}
                      </div>
                      <button
                        onClick={() => handleAddTicketTypeToSection(section.id)}
                        disabled={!selectedTicketTypeId}
                        className={`w-8 h-8 flex-shrink-0 rounded-full border-2 flex items-center justify-center text-lg font-bold transition-colors ${selectedTicketTypeId && isTicketTypeInSection(selectedTicketTypeId, section.id)
                          ? "bg-green-500 text-white border-green-500"
                          : selectedTicketTypeId
                            ? "bg-[#51DACF] text-white border-[#51DACF] hover:bg-[#0C4762]"
                            : "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
                          }`}
                      >
                        {selectedTicketTypeId && isTicketTypeInSection(selectedTicketTypeId, section.id) ? "✓" : "+"}
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">{transWithFallback("notFoundSection", "Chưa có khu vực")}</p>
                )}
              </div>
            </div>

            {/* Confirm Button */}
            {Object.keys(ticketTypeSectionMap).length > 0 && (
              <div className="mt-6">
                <button
                  onClick={handleConfirmMapping}
                  className="w-full bg-[#0C4762] text-white py-3 px-4 rounded-lg hover:bg-[#0A3A50] transition-colors font-medium"
                >
                  {isLoadingMapping ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>{transWithFallback("mapping", "Đang ánh xạ...")}</span>
                    </div>
                  ) : (
                    transWithFallback("confirmMapping", "Xác nhận ánh xạ")
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SeatMapPage