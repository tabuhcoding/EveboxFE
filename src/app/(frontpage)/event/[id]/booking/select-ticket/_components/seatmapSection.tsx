'use client';

/* Package System */
import { useTranslations } from "next-intl";
import React, { useState, useEffect, useRef } from "react";

/* Package Application */
// import AlertDialog from "components/common/alertDialog";
import { SeatMapProps, Section } from "types/models/event/booking/seatmap.interface";
import '@/styles/event/seatmap.css';

export default function SeatMapSectionComponent({ seatMap, onSeatSelectionChange, ticketType, selectedTickets = {} }: SeatMapProps) {
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
    // Chỉ lấy ticketType hợp lệ trong section này
    const sectionTypes = ticketType.filter(tt => !tt.isHidden && (section.ticketTypeId ? section.ticketTypeId === tt.id : true));
    const defaultQty: { [ticketTypeId: string]: number } = {};
    sectionTypes.forEach(tt => {
      // Tìm số lượng đã chọn trước đó cho section + ticketType
      let value = 0;
      const selected = selectedTickets?.[tt.id];
      // sectionId phải khớp mới lấy quantity, nếu không là 0
      if (selected && selected.sectionId === section.id) {
        value = selected.quantity;
      }
      defaultQty[tt.id] = value;
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
      <div className="seatmap-wrapper relative" style={{ backgroundColor: 'gray'}}>
        <div
          className="seatmap-zoom"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
            transformOrigin: "center center",
            transition: isDragging ? "none" : "transform 0.2s ease-in-out",
            cursor: isDragging ? "grabbing" : "grab"
          }}
        >
          <svg viewBox={seatMap.viewBox} className="seatmap"   style={{ backgroundColor: 'gray' }}>
            {/* Vẽ stage section */}
            {stageSections?.map((section) => (
              <g key={section.id}>
                {section.element?.map((el, index) => {
                  const commonProps = {
                    style: { fill: el.fill },
                  };

                  if (el.type === 'path') {
                    return (
                      <path
                        key={index}
                        {...commonProps}
                        d={el.data}
                        style={{
                          fill: el.fill,
                          // stroke: 'white',
                          // strokeWidth: 1
                        }}
                        transform={(el.x !== 0 || el.y !== 0) ? `translate(${el.x}, ${el.y})` : undefined}
                      />
                    );
                  } else if (el.type === 'rect') {
                    return (
                      <rect
                        key={index}
                        {...commonProps}
                        x={el.x}
                        y={el.y}
                        width={el.width}
                        height={el.height}
                        style={{
                          fill: el.fill,
                          stroke: 'white',     
                          strokeWidth: 1          
                        }}
                      />
                    );
                  }

                  return null;
                })}

              </g>
            ))}
            {/* Vẽ section thường, click để chọn */}
            {normalSections?.map((section) => {
              const isSoldOut = section.status === "SOLD_OUT";
              return (
                <g
                  key={section.id}
                  onClick={() => {
                    if (!isSoldOut) handleSectionClick(section)
                  }}
                  style={{ 
                    cursor: isSoldOut ? "not-allowed" : "pointer",
                    opacity: isSoldOut ? 0.5 : 1,
                  }}
                >
                  {section.element?.map((el, index) => {
                    const commonProps = {
                      style: { fill: el.fill },
                    };

                    if (el.type === 'path') {
                      return (
                        <path
                          key={index}
                          {...commonProps}
                          style={{
                            fill: el.fill,
                            // stroke: 'white',
                            // strokeWidth: 1
                          }}
                          d={el.data}
                          transform={(el.x !== 0 || el.y !== 0) ? `translate(${el.x}, ${el.y})` : undefined}
                        />
                      );
                    } else if (el.type === 'rect') {
                      return (
                        <rect
                          key={index}
                          {...commonProps}
                          x={el.x}
                          y={el.y}
                          width={el.width}
                          height={el.height}
                          style={{
                            fill: el.fill,
                            stroke: 'white',
                            strokeWidth: 1
                          }}
                        />
                      );
                    }

                    return null;
                  })}

                </g>
              )
            })}
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
                    {tt.description && (
                      <div className="text-xs text-gray-600 mt-1">
                        {tt.description}
                      </div>
                    )}
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
              >{transWithFallback('cancel', 'Hủy')}</button>
              <button
                className="bg-[#0C4762] text-white px-4 py-1 rounded hover:bg-[#3BB8AE]"
                onClick={handleConfirm}
              >{transWithFallback('confirm', 'Xác nhận')}</button>
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