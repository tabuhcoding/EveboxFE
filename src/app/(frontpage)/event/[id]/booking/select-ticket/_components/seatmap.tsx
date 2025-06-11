'use client';

/* Package System */
import React, { useState, FC } from "react";
import { useTranslations } from "next-intl";

/* Package Application */
import { Seat, SeatMapProps, SelectedSeatsMap } from "types/models/event/booking/seatmap.interface";
import AlertDialog from "components/common/alertDialog";
import '../../../../../../../styles/event/seatmap.css';

export default function SeatMapComponent({ seatMap, onSeatSelectionChange }: SeatMapProps) {
  const [selectedSeats, setSelectedSeats] = useState<SelectedSeatsMap>({});
  const [zoom, setZoom] = useState<number>(1);
  // const [selectedTicketType, setSelectedTicketType] = useState<string | null>(null);

  // const [alertOpen, setAlertOpen] = useState(false);
  // const [alertMessage, setAlertMessage] = useState("");


  const t = useTranslations("common");

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    if (!msg || msg.startsWith('common.')) return fallback;
    return msg;
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    // e.preventDefault();
    e.stopPropagation();

    const delta = e.deltaY;
    setZoom((prev: number) => {
      let newZoom = prev;
      if (delta < 0) {
        // wheel up: increase zoom
        newZoom = prev * 1.1;
      } else {
        // wheel down: decrease zoom
        newZoom = prev / 1.1;
      }

      return Math.min(Math.max(newZoom, 0.5), 3);
    });
  }

  // const handleSeatClick = (seat: Seat, sectionTicketTypeId: string, status: string) => {
  //   if (status !== 'AVAILABLE') return;

  //   const newSeatSelected = new Set(selectedSeats);
  //   const isSelected = newSeatSelected.has(seat.id);
  //   if (isSelected) {
  //     newSeatSelected.delete(seat.id);
  //   } else {
  //     newSeatSelected.add(seat.id);
  //   }

  //   setSelectedSeats(newSeatSelected);

  //   onSeatSelectionChange?.({ id: seat.id, ticketTypeId: sectionTicketTypeId }, !isSelected);
  // };

  const handleSeatClick = (seat: Seat, sectionTicketTypeId: string, sectionId: number, status: string) => {
    if (status !== 'AVAILABLE') return;

    // Lấy data hiện tại của loại vé đó (ticketType)
    const ticketData = selectedSeats[sectionTicketTypeId] || { seatIds: [], sectionId, quantity: 0 };
    const seatIds = ticketData.seatIds;
    const exists = seatIds.includes(seat.id);
    const newSeatIds = exists
      ? seatIds.filter(id => id !== seat.id) // Bỏ chọn nếu đã chọn
      : [...seatIds, seat.id];              // Chọn nếu chưa chọn
    const isSelected = !exists; // true nếu vừa chọn, false nếu vừa bỏ chọn

    // Gọi callback thông báo
    if (onSeatSelectionChange) {
      onSeatSelectionChange(
        { id: seat.id, ticketTypeId: sectionTicketTypeId },
        isSelected
      );
    }

    setSelectedSeats({
      ...selectedSeats,
      [sectionTicketTypeId]: {
        seatIds: newSeatIds,
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

  const stageSections = seatMap.Section?.filter(s => s.isStage);
  const normalSections = seatMap.Section?.filter(s => !s.isStage);

  return (
    <div className="seatmap-container relative overflow-hidden" onWheel={handleWheel}>
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
            transform: `scale(${zoom})`,
            transformOrigin: "center center",
            transition: "transform 0.2s ease-in-out"
          }}
        >
          <svg viewBox={seatMap.viewBox} className="seatmap">
            {stageSections?.map((section) => (
              <g key={section.id}>
                {section.element?.map((el, index) => (
                  <path
                    key={index}
                    d={el.data}
                    // fill={el.fill}
                    style={{ fill: el.fill }}
                    transform={`translate(${el.x}, ${el.y})`}
                  />
                ))}
              </g>
            ))}

            {normalSections?.map((section) => (
              <g key={section.id}>
                {section.element?.map((el, index) => (
                  <path
                    key={index}
                    d={el.data}
                    // fill={el.fill}
                    style={{ fill: el.fill }}
                    transform={`translate(${el.x}, ${el.y})`}
                  />
                ))}

                {section.Row?.map((row) =>
                  row.Seat.map((seat) => {
                    const isSelected = Object.values(selectedSeats).some(ticketInfo =>
                      ticketInfo.seatIds.includes(seat.id)
                    );


                    let fillColor: string;
                    if (seat.status === 'AVAILABLE') {
                      // Ghế trống: nếu chọn thì màu xanh lá, còn lại màu trắng
                      fillColor = isSelected ? "#6FEC61" : "white";
                    } else if (seat.status === 'SOLD' || seat.status === 'ESOLD' || seat.status === 'NOTSALE') {
                      // Vé điện tử hoặc ghế đang khóa: hiển thị màu đỏ
                      fillColor = "red";
                    } else {
                      fillColor = "gray";
                    }

                    const seatNumber = parseInt(seat.name, 10);
                    let labelOffsetX = 0;
                    if (!isNaN(seatNumber)) {
                      labelOffsetX = seatNumber % 2 === 0 ? 10 : -10;
                    }

                    const labelOffsetY = 5;

                    return (
                      <g key={seat.id}>
                        <circle
                          cx={typeof seat.positionX === "number" ? seat.positionX : seat.positionX[0] ?? 0}
                          cy={typeof seat.positionY === "number" ? seat.positionY : seat.positionY[0] ?? 0}
                          r={4}
                          stroke="#000"
                          strokeWidth={1}
                          fill={fillColor}
                          onClick={() => handleSeatClick(seat, section.ticketTypeId ?? "", section.id, seat.status)}
                          style={{ cursor: seat.status === 'AVAILABLE' ? "pointer" : "not-allowed" }}
                        />
                        {zoom >= 1.5 && (
                          <text
                            x={(typeof seat.positionX === "number" ? seat.positionX : seat.positionX[0] ?? 0) + labelOffsetX}
                            y={(typeof seat.positionY === "number" ? seat.positionY : seat.positionY[0] ?? 0) + labelOffsetY}
                            fontSize={4}
                            fill="#000"
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            {seat.name}
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

      {/* <AlertDialog
        message={alertMessage}
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
      /> */}
    </div>
  );
}