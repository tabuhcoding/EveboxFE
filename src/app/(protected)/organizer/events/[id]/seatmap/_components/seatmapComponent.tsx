'use client';

/* Package System */
import { useTranslations } from "next-intl";
import React, { useState, useEffect, useRef } from "react";

/* Package Application */
import { SeatMapProps, SelectedSeatsMap } from "types/models/event/booking/seatmap.interface";
import '@/styles/event/seatmap.css';

export default function SeatMapComponent({ seatMap, selectedSeatIds, ticketTypeSections, selectedSectionId, onSetSeatStatus, seatStatusRecord }: SeatMapProps) {
  const [selectedSeats, setSelectedSeats] = useState<SelectedSeatsMap>({});
  const [zoom, setZoom] = useState<number>(1);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const lastMousePosition = useRef({ x: 0, y: 0 });

  // const [seatStatusRecord, setSeatStatusRecord] = useState<Record<number, string>>({});

  const stageSections = seatMap.Section?.filter(s => s.isStage);
  const normalSections = seatMap.Section?.filter(s => !s.isStage);

  const t = useTranslations("common");

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    if (!msg || msg.startsWith('common.')) return fallback;
    return msg;
  };

  // useEffect(() => {
  //   const seatStatusResponse = seatMap.Section?.reduce((acc, section) => {
  //     section.Row?.forEach((row) => {
  //       row.Seat.forEach((seat) => {
  //         acc[seat.id] = seat.status;
  //       });
  //     });
  //     return acc;
  //   }, {} as Record<number, string>);
  //   setSeatStatusRecord(seatStatusResponse || {});
  // }, [seatMap]);

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
                  let commonProps = {
                    style: { fill: el.fill },
                  };

                  if (index === 0) {
                    const color = ticketTypeSections?.find(
                      (t) => t.ticketTypeId === section.ticketTypeId
                    )?.color;
                    if (color) {
                      commonProps = {
                        ...commonProps,
                        style: { fill: color },
                      };
                    } else {
                      commonProps = {
                        ...commonProps,
                        style: { fill: '#B0B0B5' },
                      };
                    }
                    if (selectedSectionId === section.id) {
                      commonProps = {
                        ...commonProps,
                        style: { fill: '#484848' },
                      };
                    }
                  }

                  if (el.type === 'path') {
                    return (
                      <path
                        key={index}
                        {...commonProps}
                        d={el.data}
                        // style={{
                        //   fill: el.fill,
                        // }}
                        transform={(el.x !== 0 || el.y !== 0) ? `translate(${el.x}, ${el.y})` : undefined}
                      />
                    );
                  } else if (el.type === 'rect') {
                    return (
                      <rect
                        key={index}
                        // {...commonProps}
                        x={el.x}
                        y={el.y}
                        width={el.width}
                        height={el.height}
                        style={{
                          fill: commonProps.style.fill,
                          stroke: 'white',     
                          strokeWidth: 1          
                        }}
                      />
                    );
                  }

                  return null;
                })}

                {section.Row?.map((row) => {
                  const seatIds = row.Seat.map((seat) => seat.id);

                  // Tính toán bounding box
                  const positions = row.Seat.map((seat) => ({
                    x: typeof seat.positionX === "number" ? seat.positionX : seat.positionX[0] ?? 0,
                    y: typeof seat.positionY === "number" ? seat.positionY : seat.positionY[0] ?? 0,
                  }));


                  // Padding để mở rộng vùng click một chút
                  const padding = 8;

                  // Tạo polygon theo dạng convex hull đơn giản (hoặc chỉ nối đầu - cuối hàng + đẩy vuông góc)
                  const points = [
                    ...positions.map((seat) => `${seat.x + padding},${seat.y + padding}`),
                    ...positions
                      .slice()
                      .reverse()
                      .map((seat) => `${seat.x - padding},${seat.y - padding}`),
                  ];

                  return (
                    <g key={row.id}>
                      {/* Hitbox */}
                      <polygon
                        points={points.join(" ")}
                        // fill="rgba(255,0,0,0.1)"
                        fill="transparent"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSetSeatStatus?.(seatIds);
                        }}
                        style={{ cursor: "pointer" }}
                      />
                      
                      {/* Các ghế */}
                      {row.Seat.map((seat) => {
                        const x = typeof seat.positionX === "number" ? seat.positionX : seat.positionX[0] ?? 0;
                        const y = typeof seat.positionY === "number" ? seat.positionY : seat.positionY[0] ?? 0;
                        const status = seatStatusRecord?.[seat.id];
                        const fill =
                          !seatStatusRecord || status === "ESOLD"
                            ? "gray"
                            : status === "AVAILABLE"
                            ? "white"
                            : "red";

                        return (
                          <g key={seat.id}>
                            <circle
                              cx={x}
                              cy={y}
                              r={4}
                              stroke="#000"
                              strokeWidth={1}
                              fill={fill}
                              onClick={(e) => {
                                e.stopPropagation();
                                onSetSeatStatus?.([seat.id]);
                              }}
                              style={{
                                cursor: status === "ESOLD" ? "not-allowed" : "pointer",
                              }}
                            />
                            {zoom >= 1.5 && (
                              <text
                                x={x}
                                y={y}
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
                      })}
                    </g>
                  );
                })}

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