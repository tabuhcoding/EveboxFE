'use client';

/* Package System */
import { useTranslations } from "next-intl";
import React, { useState, useEffect, useRef } from "react";

/* Package Application */
import { SeatMapProps, SelectedSeatsMap } from "types/models/event/booking/seatmap.interface";
import '@/styles/event/seatmap.css';
import { TicketTypeSectionsProps } from "./editSeatmapPage";

export default function SeatMapComponent({ seatMap, selectedSeatIds, ticketTypeSections }: SeatMapProps) {
  const [selectedSeats, setSelectedSeats] = useState<SelectedSeatsMap>({});
  const [zoom, setZoom] = useState<number>(1);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const lastMousePosition = useRef({ x: 0, y: 0 });

  const stageSections = seatMap.Section?.filter(s => s.isStage);
  const normalSections = seatMap.Section?.filter(s => !s.isStage);

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

  const getSeatLabel = (rowName: string, seatName: string): string => {
    const cleanRow = rowName.replace(/"/g, '');
    const cleanSeat = seatName.replace(/"/g, '');
    return `${cleanRow}-${cleanSeat}`;
  }

  const selectedSeatLabels: string[] = [];
  if (seatMap.Section) {
    seatMap?.Section?.forEach((section) => {
      section?.Row?.forEach((row) => {
        row.Seat.forEach((seat) => {
          const isSeatSelected = Object.values(selectedSeats).some(ticketInfo =>
            ticketInfo.seatIds.includes(seat.id)
          );
          if (isSeatSelected) {
            selectedSeatLabels.push(getSeatLabel(row.name, seat.name));
          }

        });
      });
    });
  }

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
      <div className="seatmap-wrapper relative" style={{ backgroundColor: 'gray' }}>
        <div
          className="seatmap-zoom"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
            transformOrigin: "center center",
            transition: isDragging ? "none" : "transform 0.2s ease-in-out",
            cursor: isDragging ? "grabbing" : "grab"
          }}
        >
          <svg viewBox={seatMap.viewBox} className="seatmap" style={{ backgroundColor: 'gray' }}>
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
                })}</g>
            ))}

            {normalSections?.map((section) => (
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

                {section.Row?.map((row) =>
                  row.Seat.map((seat) => {
                    return (
                      <g key={seat.id}>
                        <circle
                          cx={typeof seat.positionX === "number" ? seat.positionX : seat.positionX[0] ?? 0}
                          cy={typeof seat.positionY === "number" ? seat.positionY : seat.positionY[0] ?? 0}
                          r={4}
                          stroke="#000"
                          strokeWidth={1}
                          fill={"white"}
                          // onClick={() => handleSeatClick(seat, section.ticketTypeId ?? "", section.id, seat.status, row.name)}
                          // style={{ cursor: seat.status === 'AVAILABLE' ? "pointer" : "not-allowed" }}
                        />
                        {zoom >= 1.5 && (
                          <text
                            x={(typeof seat.positionX === "number" ? seat.positionX : seat.positionX[0] ?? 0) }
                            y={(typeof seat.positionY === "number" ? seat.positionY : seat.positionY[0] ?? 0) }
                            fontSize={4}
                            fill="#000"
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            {String(seat.name).replace(/"/g, "")}
                          </text>
                        )}
                      </g>
                    );
                  })
                )}
              </g>
            ))}
          </svg>
        </div>

        <div className="selected-seats absolute bottom-0 left-0 w-full text-center text-sm font-bold bg-white bg-opacity-80 p-1">
          {transWithFallback('selectedPos', 'Vị trí đã chọn')}: {selectedSeatLabels.reverse().join(", ")}
        </div>
      </div>
    </div>
  );
}