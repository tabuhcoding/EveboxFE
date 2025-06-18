'use client';

/* Package System */
import { useTranslations } from "next-intl";
import React, { useState, useEffect, useRef } from "react";

/* Package Application */
// import AlertDialog from "components/common/alertDialog";
import { SeatMapProps, Section } from "types/models/event/booking/seatmap.interface";
import '@/styles/event/seatmap.css';

export default function SeatMapSectionComponent({ seatMap, onSeatSelectionChange, ticketType, selectedSeatIds }: SeatMapProps) {
  console.log("🚀 ~ SeatMapSectionComponent ~ selectedSeatIds:", selectedSeatIds)
  const t = useTranslations("common");

  // const [alertOpen, setAlertOpen] = useState(false);
  // const [alertMessage, setAlertMessage] = useState("");
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [sectionTickets, setSectionTickets] = useState<{ [ticketTypeId: string]: number }>({});

  const [zoom, setZoom] = useState<number>(1);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const lastMousePosition = useRef({ x: 0, y: 0 });
  // const [selectedTicketType, setSelectedTicketType] = useState<string | null>(null);

  const stageSections = seatMap.Section?.filter(s => s.isStage);
  const normalSections = seatMap.Section?.filter(s => !s.isStage);

  const seatmapRef = useRef<HTMLDivElement>(null);

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    if (!msg || msg.startsWith('common.')) return fallback;
    return msg;
  };

  useEffect(() => {
    const container = seatmapRef.current;

    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY;
      setZoom((prev: number) => {
        const newZoom = delta < 0 ? prev * 1.1 : prev / 1.1;
        return Math.min(Math.max(newZoom, 0.5), 3);
      });
    };

    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, []);

  const isDraggingRef = useRef(false);

  useEffect(() => {
    const container = seatmapRef.current;
    if (!container) return;

    const handleMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      isDraggingRef.current = true;
      lastMousePosition.current = { x: e.clientX, y: e.clientY };
      setIsDragging(true);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;

      const dx = e.clientX - lastMousePosition.current.x;
      const dy = e.clientY - lastMousePosition.current.y;

      setPosition(prev => ({
        x: prev.x + dx,
        y: prev.y + dy,
      }));

      lastMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      setIsDragging(false);
    };

    container.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      container.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const handleSectionClick = (section: Section) => {
    setSelectedSection(section);
    // Khởi tạo số lượng về 0 cho từng loại vé thuộc section này
    const sectionTypes = ticketType.filter(tt => !tt.isHidden && (section.ticketTypeId ? section.ticketTypeId === tt.id : true));
    const defaultQty: { [ticketTypeId: string]: number } = {};
    sectionTypes.forEach(tt => {
      defaultQty[tt.id] = 0;
    });
    setSectionTickets(defaultQty);
  };

  const handleIncrease = (ticketTypeId: string, maxQty: number) => {
    setSectionTickets(prev => ({
      ...prev,
      [ticketTypeId]: Math.min((prev[ticketTypeId] || 0) + 1, maxQty)
    }));
  };

  const handleDecrease = (ticketTypeId: string) => {
    setSectionTickets(prev => ({
      ...prev,
      [ticketTypeId]: Math.max((prev[ticketTypeId] || 0) - 1, 0)
    }));
  };

  const handleConfirm = () => {
    if (!selectedSection) return;
    Object.entries(sectionTickets).forEach(([ticketTypeId, qty]) => {
      if (qty > 0 && onSeatSelectionChange) {
        // Truyền 1 lần duy nhất (không lặp seatId), vì chỉ cần tổng quantity + sectionId
        onSeatSelectionChange({
          id: selectedSection.id,
          ticketTypeId,
          label: [selectedSection.name]
        }, true, qty, selectedSection.id);
      }
    });
    setSelectedSection(null);
  };


  const handleCancel = () => {
    setSelectedSection(null);
  };

  return (
    <div className="seatmap-container relative overflow-hidden" ref={seatmapRef}>
      {/* Legend */}
      <div className="seatmap-legend-container absolute top-0 left-[50%] transform -translate-x-1/2 z-10 bg-white bg-opacity-80 w-full">
        <div className="mb-3 seatmap-legend justify-between">
          <div className="legend-item">
            <span className="seat available"></span> {transWithFallback('availableSeat', 'Ghế có sẵn')}
          </div>
          <div className="legend-item">
            <span className="seat booked"></span> {transWithFallback('bookedSeat', 'Ghế đã đặt')}
          </div>
          <div className="legend-item">
            <span className="seat selected"></span> {transWithFallback('selectedSeat', 'Ghế đang chọn')}
          </div>
        </div>
      </div>

      <div className="seatmap-wrapper relative">
        <div
          className="seatmap-zoom"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
            transformOrigin: "center center",
            transition: isDragging ? "none" : "transform 0.2s ease-in-out",
            cursor: isDragging ? "grabbing" : "grab"
          }}
        >
          <svg viewBox={seatMap.viewBox} className="seatmap">
            {/* Vẽ stage section */}
            {stageSections?.map((section) => (
              <g key={section.id}>
                {section.element?.map((el, index) => (
                  el.type === 'path' ? (
                    <path
                      key={index}
                      d={el.data}
                      style={{ fill: el.fill }}
                      transform={`translate(${el.x}, ${el.y})`}
                    />
                  ) : el.type === 'rect' ? (
                    <rect
                      key={index}
                      x={el.x}
                      y={el.y}
                      width={el.width}
                      height={el.height}
                      style={{ fill: el.fill }}
                      transform={`translate(${el.x}, ${el.y})`}
                    />
                  ) : <h1>DUUDUDUDUDUDUD</h1>
                ))}
              </g>
            ))}
            {/* Vẽ section thường, click để chọn */}
            {normalSections?.map((section) => (
              <g
                key={section.id}
                onClick={() => handleSectionClick(section)}
                style={{ cursor: "pointer" }}
              >
                {section.element?.map((el, index) => (
                  el.type === 'path' ? (
                    <path
                      key={index}
                      d={el.data}
                      style={{ fill: el.fill }}
                      transform={`translate(${el.x}, ${el.y})`}
                    />
                  ) : el.type === 'rect' ? (
                    <rect
                      key={index}
                      x={el.x}
                      y={el.y}
                      width={el.width}
                      height={el.height}
                      style={{ fill: el.fill }}
                      transform={`translate(${el.x}, ${el.y})`}
                    />
                  ) : <h1>DUUDUDUDUDUDUD</h1>
                ))}
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* Modal chọn vé (opacity 0.4) */}
      {selectedSection && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50"
          style={{ background: 'rgba(0,0,0,0.4)' }}>
          <div className="bg-white p-6 rounded-lg shadow-lg min-w-[340px] relative">
            <button
              className="absolute right-2 top-2 px-2 py-1 rounded hover:bg-gray-100"
              onClick={handleCancel}
              title="Đóng"
            >✕</button>
            <h2 className="font-bold text-xl mb-4">{selectedSection.name}</h2>
            {ticketType
              .filter(tt => !tt.isHidden && (!selectedSection.ticketTypeId || selectedSection.ticketTypeId === tt.id))
              .map(tt => (
                <div key={tt.id} className="flex justify-between items-center mb-3">
                  <div>
                    <div className="font-semibold">{tt.name}</div>
                    <div className="text-gray-500">{tt.price?.toLocaleString('vi-VN')}đ</div>
                  </div>
                  <div className="flex items-center">
                    <button
                      className="bg-gray-200 px-2 py-1 rounded-l"
                      onClick={() => handleDecrease(tt.id)}
                      disabled={sectionTickets[tt.id] <= 0}
                    >-</button>
                    <span className="px-3">{sectionTickets[tt.id] || 0}</span>
                    <button
                      className="bg-gray-200 px-2 py-1 rounded-r"
                      onClick={() => handleIncrease(tt.id, tt.maxQtyPerOrder)}
                      disabled={(sectionTickets[tt.id] || 0) >= tt.maxQtyPerOrder}
                    >+</button>
                  </div>
                </div>
              ))}
            <div className="flex justify-end mt-4 gap-2">
              <button
                className="bg-gray-300 px-4 py-1 rounded hover:bg-gray-400"
                onClick={handleCancel}
              >{t('cancel', { defaultValue: 'Hủy' })}</button>
              <button
                className="bg-[#0C4762] text-white px-4 py-1 rounded hover:bg-[#3BB8AE]"
                onClick={handleConfirm}
              >{t('confirm', { defaultValue: 'Xác nhận' })}</button>
            </div>
          </div>
        </div>
      )}

      {/* <AlertDialog
        message={alertMessage}
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
      /> */}
    </div>
  );
}