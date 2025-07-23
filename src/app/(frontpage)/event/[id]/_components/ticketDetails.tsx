'use client';

/* Package System */
import { ChevronDown, ChevronRight } from "lucide-react";
import { CircularProgress } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";

/* Package Application */
import { EventDetail, Showing } from "../../../../../types/models/event/eventdetail/event.interface";
import { getRedisSeat } from "@/services/booking.service";
import { useAuth } from "@/contexts/auth.context";

import ContinueDialog from "./continueDialog";
import AlertDialog from "@/components/common/alertDialog";

const TicketDetails = ({ showings, event }: { showings: Showing[], event: EventDetail }) => {
  const [expandedShowId, setExpandedShowId] = useState<string | null>(null);
  const [expandedTicketId, setExpandedTicketId] = useState<string | null>(null);
  const [loadingButtonId, setLoadingButtonId] = useState<string | null>(null);
  const router = useRouter();
  const t = useTranslations("common");
  const { session } = useAuth();

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [continueOpen, setContinueOpen] = useState(false);
  const [continueMessage, setContinueMessage] = useState("");
  const [href, setHref] = useState("");
  const [continueHref, setContinueHref] = useState("");

  const [ownEventDialogOpen, setOwnEventDialogOpen] = useState(false);
  const [ownEventContinueAction, setOwnEventContinueAction] = useState<() => void>(() => () => {});

  useEffect(() => {
    const showingStatus = localStorage.getItem('showingStatus');
    if (showingStatus) {
      console.log("Showing status từ localStorage:", showingStatus);
      setTimeout(() => {
        localStorage.removeItem('showingStatus');
      }, 500);
    }
  }, []);

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    return !msg || msg.startsWith('common.') ? fallback : msg;
  };

  const handleBuyButton = async (eventId: number, showingId: string, seatMapId: number, buttonId: string) => {
    setLoadingButtonId(buttonId);
    const accessToken = session?.user?.accessToken;
    if (!accessToken) {
      setLoadingButtonId(null);
      setAlertMessage(transWithFallback("pleaseLogin", "Vui lòng đăng nhập để truy cập vào trang này!"));
      setHref("/login");
      setAlertOpen(true);
      return;
    }

    const fetchRedisSeat = async () => {
      try {
        const res = await getRedisSeat(showingId);

        if (res?.statusCode === 200) {
          return res.data;
        }
        return null
      } catch (error: any) {
        console.error(`${transWithFallback('errorGetRedisSeat', 'Lỗi khi lấy thông tin từ redis')}:`, error)
        return null
      }
    }

    const redisSeat = await fetchRedisSeat();
    if (!redisSeat) {
      return router.push(`/event/${eventId}/booking/select-ticket?showingId=${showingId}&eventId=${eventId}${(seatMapId && seatMapId !== 0) ? `&seatMapId=${seatMapId}` : ""}`);
    }
    const timeLeft = redisSeat.expiredTime;
    if (timeLeft && timeLeft > 0) {
      setLoadingButtonId(null);
      setContinueMessage(transWithFallback("continueBooking", "Bạn đang mua vé trước đó, bạn có muốn tiếp tục tiến trình mua vé không?"));
      setContinueHref(`/event/${eventId}/booking/select-ticket?showingId=${showingId}&eventId=${eventId}${(seatMapId && seatMapId !== 0) ? `&seatMapId=${seatMapId}` : ""}`);
      setContinueOpen(true);
      return;
    }
    router.push(`/event/${eventId}/booking/select-ticket?showingId=${showingId}&eventId=${eventId}${(seatMapId && seatMapId !== 0) ? `&seatMapId=${seatMapId}` : ""}`);
  }

  return (
    <>
      <div className="flex justify-center mt-8 ml-2 ticket-list" id="info-ticket">
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
                            <button type="button" className="btn-buy flex items-center justify-center gap-1"
                              onClick={() => {
                                localStorage.setItem('showingStatus', 'REGISTER_NOW')
const isOwnEvent = event.organizerId === session?.user?.email;
if (isOwnEvent) {
  setOwnEventDialogOpen(true);
  setOwnEventContinueAction(() => () =>
    handleBuyButton(showing.eventId, showing.id, showing.seatMapId, showing.id)
  );
} else {
  handleBuyButton(showing.eventId, showing.id, showing.seatMapId, showing.id);
}                              }}
                              disabled={loadingButtonId === showing.id}
                            >
                              {loadingButtonId === showing.id ? (
                                <>
                                  <CircularProgress size={16} />
                                  {t('loadingBtn') || "Đang xử lý..."}
                                </>
                              ) : (t('registerNow') || "Đăng ký ngay")}
                            </button>
                          );

                        case "BOOK_NOW":
                          return (
                            <button
                              type="button"
                              disabled={loadingButtonId === showing.id}
                              className="btn-buy flex items-center justify-center gap-1"
                              onClick={() => {
                                localStorage.setItem('showingStatus', 'BOOK_NOW')
                                const isOwnEvent = event.organizerId === session?.user?.email;
if (isOwnEvent) {
  setOwnEventDialogOpen(true);
  setOwnEventContinueAction(() => () =>
    handleBuyButton(showing.eventId, showing.id, showing.seatMapId, showing.id)
  );
} else {
  handleBuyButton(showing.eventId, showing.id, showing.seatMapId, showing.id);
}          
                              }}
                            >
                              {loadingButtonId === showing.id ? (
                                <CircularProgress size={16} />
                              ) : (t('bookNow') || "Mua vé ngay")}
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

                        case "SHOWING_OVER":
                          return (
                            <button type="button" className="btn-disable cursor-not-allowed" disabled>
                              {t('showingOver') || "Đã kết thúc"}
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
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <div className="flex items-start gap-4 mb-2">
                              {/* Toggle Chevron + Ticket Name */}
                              <div
                                role="button"
                                tabIndex={0}
                                onClick={() =>
                                  setExpandedTicketId(expandedTicketId === ticket.id ? null : ticket.id)
                                }
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    setExpandedTicketId(expandedTicketId === ticket.id ? null : ticket.id);
                                  }
                                }}
                                className="flex items-center gap-2 cursor-pointer ml-2 text-ticket text-lg font-bold text-[#9ef5cf]"
                              >
                                {ticket.description !== "Default Ticket Description" ? (
                                  expandedTicketId === ticket.id ? (
                                    <ChevronDown size={18} />
                                  ) : (
                                    <ChevronRight size={18} />
                                  )
                                ) : (null)}
                                {ticket.name}
                              </div>
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

                          {expandedTicketId === ticket.id && ticket.description !== "Default Ticket Description" && (
                            <div className="flex items-start gap-4 mb-4 mt-2">
                              {/* Ticket Image */}
                              {ticket.imageUrl && ticket.imageUrl.startsWith("http") && (
                                <Image
                                  width={140}
                                  height={100}
                                  src={ticket.imageUrl}
                                  alt={ticket.name}
                                  className="w-32 h-auto rounded-lg shadow-md object-cover"
                                />
                              )}

                              {/* Ticket Description */}
                              <div className="flex-1" style={{ whiteSpace: "pre-line" }}>
                                <p className="text-white-500 text-sm ml-4">{ticket.description}</p>
                              </div>
                            </div>
                          )}
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
      <div className="contact-org flex justify-center mt-8 ml-2">
        <div className="w-full md:w-5/6">
          <h2 className="text-xl md:text-2xl font-bold">{t('contactOrganizer') || "Liên hệ ban tổ chức"}</h2>

          {/* Organizer Section */}
          <div className="flex items-center">
            {/* Organizer Image */}
            <div className="w-[120px] md:w-[160px] flex-shrink-0 flex items-center justify-center text-base">
              {event.imgLogoUrl ? (
                <Image
                  width={160}
                  height={120}
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
                dangerouslySetInnerHTML={{ __html: event.orgDescription || '' }}
              />
            </div>
          </div>
        </div>
      </div>
      <AlertDialog
        message={alertMessage}
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
        href={href}
      />

      <ContinueDialog
        message={continueMessage}
        onClose={() => setContinueOpen(false)}
        open={continueOpen}
        href={continueHref}
      />

      <ContinueDialog
  message={transWithFallback("ownEventWarning", "Bạn đang đăng ký sự kiện của chính mình. Bạn có muốn tiếp tục không?")}
  onClose={() => setOwnEventDialogOpen(false)}
  open={ownEventDialogOpen}
  href=""
  onConfirm={() => {
    setOwnEventDialogOpen(false);
    ownEventContinueAction();
  }}
/>
    </>
  )
};

export default TicketDetails;