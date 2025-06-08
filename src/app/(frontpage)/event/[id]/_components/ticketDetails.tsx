'use client';

/* Package System */
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

/* Package Application */
import { Showing } from "../../../../../types/models/event/eventdetail/event.interface";
import { useTranslations } from "next-intl";
import { EventDetail } from '../../../../../types/models/event/eventdetail/event.interface';


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
                    <div className="d-flex text-ticket" onClick={() => setExpandedShowId(expandedShowId === showing.id ? null : showing.id)}>
                      <div className="mr-2">
                        {expandedShowId === showing.id ? (
                          <i className="bi bi-chevron-down"></i>
                        ) : (
                          <i className="bi bi-chevron-right"></i>
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
                    {showing.status === "sold_out" ? (
                      <button type="button" className="btn-sold-out cursor-none">{t('soldOut')}</button>
                    ) : (
                      <button
                        type="button"
                        className="btn-buy"
                        onClick={() => router.push(`/event/${showing.eventId}/booking/select-ticket?showingId=${showing.id}&eventId=${showing.eventId}${(showing.seatMapId && showing.seatMapId !== 0) ? `&seatMapId=${showing.seatMapId}` : ""}`)}
                      >
                        {t('bookNow')}
                      </button>
                    )}
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
                              {ticket.status === "sold_out" ? (
                                <>
                                  <p className="price !text-gray-700 p-2">{ticket.price?.toLocaleString("vi-VN")}đ</p>
                                  <button type="button" className="btn-sold-out">Hết vé</button>
                                </>
                              ) : (
                                <p className="price mb-0 !border !border-[#9ef5cf] rounded-lg p-2">{ticket.price?.toLocaleString("vi-VN")}đ</p>
                              )}
                            </div>
                          </div>
                          {/* Ticket Image */}
                          {ticket.imageUrl && (
                            <div className="text-center">
                              <Image width={140}
                                height={100} src={ticket.imageUrl} alt={ticket.name} className="w-32 rounded-lg shadow-md" />
                            </div>
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
          <div className="flex items-center mt-4">
            {/* Organizer Image */}
            <div className="w-20 h-20 flex-shrink-0">
              {event.Images_Events_imgLogoIdToImages?.imageUrl ? (
                <Image
                  width={200}
                  height={160}
                  src={event.Images_Events_imgLogoIdToImages?.imageUrl || ''}
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