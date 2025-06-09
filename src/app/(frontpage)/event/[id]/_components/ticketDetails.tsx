'use client';

/* Package System */
import { ChevronDown, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";

/* Package Application */
import { EventDetail, Showing } from "../../../../../types/models/event/eventdetail/event.interface";

const TicketDetails = ({ showings, event }: { showings: Showing[], event: EventDetail }) => {
  const [expandedShowId, setExpandedShowId] = useState<string | null>(null);
  // const [isTicketInfoExpanded, setIsTicketInfoExpanded] = useState(false);
  // const [isTicketNoteExpanded, setIsTicketNoteExpanded] = useState(false);
  const router = useRouter();
  const t = useTranslations("common");

  return (
    <>
      <div className="flex justify-center mt-8 ml-2" id="info-ticket">
        <div className="w-full md:w-5/6">
          <h2 className="text-xl md:text-2xl font-bold">{t("ticketInfo") || "Thông tin vé"}</h2>
          <div className="card mt-3">
            <ul className="list-group list-group-flush">
              {Array.isArray(showings) && showings.map((showing) => (
                <li key={showing.id} className="list-group-item li-ticket">
                  <div className="d-flex justify-content-between align-items-center">
                    {/* Toggle Button for Show Details */}
                    <div role="button" tabIndex={0}
                      className="d-flex text-ticket" onClick={() => {
                        setExpandedShowId(expandedShowId === showing.id ? null : showing.id)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setExpandedShowId(expandedShowId === showing.id ? null : showing.id);
                        }
                      }}>
                      <div className="mr-2 cursor-pointer" style={{ position: 'relative', top: '3px' }}>
                        {expandedShowId === showing.id ? (
                          <ChevronDown size={20} />
                        ) : (
                          <ChevronRight size={20} />
                        )}
                      </div>
                      {new Date(showing.startTime).toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      -{" "}
                      {new Date(showing.endTime).toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      {new Date(showing.startTime).toLocaleDateString("vi-VN")}
                    </div>

                    {/* Button: Show Availability */}
                    {(() => {
                      switch (showing.status) {
                        case "SOLD_OUT":
                          return (
                            <button type="button" className="btn-sold-out cursor-not-allowed" disabled>
                              {t('soldOut') || "Hết vé"}
                            </button>
                          );

                        case "REGISTER_NOW":
                          return (
                            <button type="button" className="btn-buy" onClick={() =>
                              router.push(`/event/${showing.eventId}/register?showingId=${showing.id}`)}>
                              {t('registerNow') || "Đăng ký ngay"}
                            </button>
                          );

                        case "BOOK_NOW":
                          return (
                            <button
                              type="button"
                              className="btn-buy"
                              onClick={() =>
                                router.push(`/event/${showing.eventId}/booking/select-ticket?showingId=${showing.id}&eventId=${showing.eventId}${(showing.seatMapId && showing.seatMapId !== 0) ? `&seatMapId=${showing.seatMapId}` : ""}`)
                              }
                            >
                              {t('bookNow') || "Mua vé ngay"}
                            </button>
                          );

                        case "NOT_OPEN":
                          return (
                            <button type="button" className="btn-disable cursor-not-allowed" disabled>
                              {t('notOpen') || "Vé chưa mở bán"}
                            </button>
                          );

                        case "REGISTER_CLOSED":
                          return (
                            <button type="button" className="btn-disable cursor-not-allowed" disabled>
                              {t('registerClosed') || "Đã đóng đăng ký"}
                            </button>
                          );

                        case "SALE_CLOSED":
                          return (
                            <button type="button" className="btn-disable cursor-not-allowed" disabled>
                              {t('saleClosed') || "Vé ngừng bán"}
                            </button>
                          );

                        default:
                          return (
                            <button type="button" className="btn-disable cursor-not-allowed" disabled>
                              {t('unavailable') || "Không khả dụng"}
                            </button>
                          );
                      }
                    })()}
                  </div>

                  {/* Ticket Types for This Showing */}
                  {expandedShowId === showing.id && (
                    <ul className="ul-ticket-item">
                      {showing.TicketType.map((ticket) => (
                        <li key={ticket.id} className="li-ticket-item !border-dashed !border-white-500 rounded-lg p-4 shadow-md">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <div className="d-flex ml-2 text-ticket text-lg font-bold text-[#9ef5cf]">
                              {ticket.name}
                            </div>
                            <div className="d-flex flex-column align-items-end">
                              {(() => {
                                switch (ticket.status) {
                                  case "SOLD_OUT":
                                    return (
                                      <>
                                        <p className="price !text-gray-200">
                                          {ticket.price?.toLocaleString("vi-VN")}đ
                                        </p>
                                        <button type="button" className="btn-sold-out-ticket" disabled>
                                          {t('soldOutTicket') || "Hết vé"}
                                        </button>
                                      </>
                                    );

                                  case "REGISTER_NOW":
                                    return (
                                      <>
                                        <p className="price mb-0 !border !border-[#9ef5cf] rounded-lg p-2">
                                          {ticket.price?.toLocaleString("vi-VN")}đ
                                        </p>
                                      </>
                                    );

                                  case "BOOK_NOW":
                                    return (
                                      <p className="price mb-0 !border !border-[#9ef5cf] rounded-lg p-2">
                                        {ticket.price?.toLocaleString("vi-VN")}đ
                                      </p>
                                    );

                                  case "REGISTER_CLOSED":
                                    return (
                                      <>
                                        <p className="price !text-gray-200">
                                          {ticket.price?.toLocaleString("vi-VN")}đ
                                        </p>
                                        <button type="button" className="btn-disable-ticket" disabled>
                                          {t('registerClosedTicket') || "Đóng đăng ký"}
                                        </button>
                                      </>
                                    );

                                  case "SALE_CLOSED":
                                    return (
                                      <>
                                        <p className="price !text-gray-200">
                                          {ticket.price?.toLocaleString("vi-VN")}đ
                                        </p>
                                        <button type="button" className="btn-disable-ticket" disabled>
                                          {t('saleClosedTicket') || "Ngừng bán"}
                                        </button>
                                      </>
                                    );

                                  case "NOT_OPEN":
                                    return (
                                      <>
                                        <p className="price !text-gray-200">
                                          {ticket.price?.toLocaleString("vi-VN")}đ
                                        </p>
                                        <button type="button" className="btn-disable-ticket" disabled>
                                          {t('notOpenTicket') || "Chưa mở bán"}
                                        </button>
                                      </>
                                    );

                                  default:
                                    return (
                                      <>
                                        <p className="price text-muted p-2">
                                          {ticket.price?.toLocaleString("vi-VN")}đ
                                        </p>
                                        <button type="button" className="btn-disable-ticket" disabled>
                                          {t('unavailable') || "Không khả dụng"}
                                        </button>
                                      </>
                                    );
                                }
                              })()}
                            </div>
                          </div>
                          {/* Ticket Image */}
                          {ticket.imageUrl && ticket.imageUrl.startsWith("http") && (
                            <Image
                              width={140}
                              height={100}
                              src={ticket.imageUrl}
                              alt={ticket.name}
                              className="w-32 rounded-lg shadow-md"
                            />
                          )}

                          {/* Ticket Description */}
                          <div style={{ whiteSpace: 'pre-line' }}>
                            <p className="text-white-500 text-sm ml-4">{ticket.description}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="flex justify-center mt-8 ml-2">
        <div className="w-full md:w-5/6">
          <h2 className="text-xl md:text-2xl font-bold">{t('contactOrganizer')}</h2>

          {/* Organizer Section */}
          <div className="flex items-center">
            {/* Organizer Image */}
            <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center text-base">
              {event.imgLogoUrl ? (
                <Image
                  width={200}
                  height={160}
                  src={event.imgLogoUrl || ''}
                  alt={event.orgName}
                  className="object-cover rounded-md"
                />
              ) : null}
            </div>

            {/* Organizer Details */}
            <div className="ml-4">
              <h2 className="text-xl px-2 md:text-xl font-bold">{event.orgName}</h2>
              <div
                className="prose max-w-none px-2 text-gray-800"
                dangerouslySetInnerHTML={{ __html: event.orgDescription }}
              />
            </div>
          </div>
        </div>
      </div>

    </>
  )
};

export default TicketDetails;