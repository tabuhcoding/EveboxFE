'use client';

/* Package System */
import { useTranslations } from "next-intl";
import React, { useState, useEffect, useRef } from "react";

/* Package Application */
import AlertDialog from "components/common/alertDialog";
import { Seat, SeatMapProps, SelectedSeatsMap } from "types/models/event/booking/seatmap.interface";
import '@/styles/event/seatmap.css';

export default function SeatMapSectionComponent({ seatMap, onSeatSelectionChange, ticketType, selectedSeatIds }: SeatMapProps) {
  const [selectedSeats, setSelectedSeats] = useState<SelectedSeatsMap>({});
  const [zoom, setZoom] = useState<number>(1);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const lastMousePosition = useRef({ x: 0, y: 0 });
  // const [selectedTicketType, setSelectedTicketType] = useState<string | null>(null);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");


  const t = useTranslations("common");

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    if (!msg || msg.startsWith('common.')) return fallback;
    return msg;
  };

  useEffect(() => {
    if (!selectedSeatIds || selectedSeatIds.length === 0) {
      setSelectedSeats({});
    }
  }, [selectedSeatIds]);

  const handleSeatClick = (seat: Seat, sectionTicketTypeId: string, sectionId: number, status: string, rowName: string) => {
    if (status !== 'AVAILABLE') return;

    // Lấy data hiện tại của loại vé đó (ticketType)
    const ticket = ticketType.find((t) => t.id === sectionTicketTypeId);
    const ticketData = selectedSeats[sectionTicketTypeId] || { seatIds: [], labels: [], sectionId, quantity: 0 };
    const seatIds = ticketData.seatIds;
    const labels = ticketData.labels || [];
    const cleanRowName = rowName.replace(/"/g, '');
    const cleanSeatName = seat.name.replace(/"/g, '');
    const seatLabel = `${cleanRowName}-${cleanSeatName}`;
    const exists = seatIds.includes(seat.id);
    const maxQty = ticket?.maxQtyPerOrder ?? Infinity

    let newSeatIds: number[];
    let newLabels: string[] = [];
    let isSelected: boolean;

    if (exists) {
      newSeatIds = seatIds.filter(id => id !== seat.id);
      newLabels = labels.filter(label => label !== seatLabel);
      isSelected = false;
    } else {
      if (seatIds.length + 1 > maxQty) {
        setAlertMessage(
          `${transWithFallback('ticketQuantity', 'Số lượng vé')} ${ticket?.name} ${transWithFallback('mustMax', 'không được vượt quá')} ${maxQty}`
        );
        setAlertOpen(true);
        return;
      }
      newSeatIds = [...seatIds, seat.id];
      newLabels = [...labels, seatLabel];
      isSelected = true;
    }

    // Gọi callback thông báo
    if (onSeatSelectionChange) {
      onSeatSelectionChange(
        { id: seat.id, ticketTypeId: sectionTicketTypeId, label: newLabels },
        isSelected
      );
    }

    setSelectedSeats({
      ...selectedSeats,
      [sectionTicketTypeId]: {
        seatIds: newSeatIds,
        labels: newLabels,
        sectionId,
        quantity: newSeatIds.length,
      },
    });
  };

  const getSeatLabel = (rowName: string, seatName: string): string => {
    const cleanRow = rowName.replace(/"/g, '');
    const cleanSeat = seatName.replace(/"/g, '');
    return `${cleanRow}-${cleanSeat}`;
  }

  // const selectedSeatLabels: string[] = [];
  // if (seatMap.Section) {
  //   seatMap?.Section?.forEach((section) => {
  //     section?.Row?.forEach((row) => {
  //       row.Seat.forEach((seat) => {
  //         const isSeatSelected = Object.values(selectedSeats).some(ticketInfo =>
  //           ticketInfo.seatIds.includes(seat.id)
  //         );
  //         if (isSeatSelected) {
  //           selectedSeatLabels.push(getSeatLabel(row.name, seat.name));
  //         }

  //       });
  //     });
  //   });
  // }

  const stageSections = seatMap.Section?.filter(s => s.isStage);
  const normalSections = seatMap.Section?.filter(s => !s.isStage);

  const seatmapRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="seatmap-container relative overflow-hidden" ref={seatmapRef}>
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
            {stageSections?.map((section) => (
              <g key={section.id}>
                {section.element?.map((el, index) => (
                  el.type === 'path' ? (
                  <path
                    key={index}
                    d={el.data}
                    // fill={el.fill}
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
                    // fill={el.fill}
                    style={{ fill: el.fill }}
                    transform={`translate(${el.x}, ${el.y})`}
                  />
                ) : <h1>DUUDUDUDUDUDUD</h1>
                ))}
              </g>
            ))}

            {normalSections?.map((section) => (
              <g key={section.id}
              onClick={() => {
                setAlertMessage(
                  `Làm tiếp đi tưởng xong à mà chọn?`
                );
                setAlertOpen(true);
              }}
              >
                {section.element?.map((el, index) => (
                  el.type === 'path' ? (
                  <path
                    key={index}
                    d={el.data}
                    // fill={el.fill}
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
                    // fill={el.fill}
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

      <AlertDialog
        message={alertMessage}
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
      />
    </div>
  );
}