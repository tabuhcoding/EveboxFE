'use client';

/* Package System */
import { useTranslations } from "next-intl";
import React, { useState, useEffect, useRef } from "react";

/* Package Application */
// import AlertDialog from "components/common/alertDialog";
import { SeatMapProps } from "types/models/event/booking/seatmap.interface";
import '@/styles/event/seatmap.css';

export default function SeatMapSectionComponent({ seatMap, onSeatSelectionChange, ticketType, selectedTickets = {} }: SeatMapProps) {
  const t = useTranslations("common");

  const [zoom, setZoom] = useState<number>(1);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const lastMousePosition = useRef({ x: 0, y: 0 });
  // const [selectedTicketType, setSelectedTicketType] = useState<string | null>(null);

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
              return (
                <g
                  key={section.id}
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
    </div>
  );
}