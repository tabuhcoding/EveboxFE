'use client';

/* Package System */
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useState } from "react";

/* Package Application */
import { useI18n } from "@/app/providers/i18nProvider";
import AlertDialog from "@/components/common/alertDialog";
import { unselectSeat } from "@/services/booking.service";
import { checkoutPayment } from "@/services/payment.service";
import { TicketInforProps } from "@/types/models/event/booking/payment.interface";

import ConfirmDialog from "../../question-form/_components/confirmDialog";

export default function TicketInformation({ event, totalTickets, totalAmount, selectedTickets, ticketType, paymentMethod, showingId, seatMapId, redisInfo }: TicketInforProps) {
  console.log("🚀 ~ TicketInformation ~ totalTickets:", totalTickets)
  const { locale } = useI18n();
  const t = useTranslations('common');
  const { data: session } = useSession();

  // const [promoCode, setPromoCode] = useState('');

  // const [isOpen, setIsOpen] = useState(false);
  const [openUnselectSeatDialog, setOpenUnselectSeatDialog] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // const handleOpenDialog = () => {
  //   setIsOpen(true);
  // };

  const handlePayment = async () => {
    // if (paymentMethod === '') {
    //   handleOpenDialog();
    //   return;
    // }

    if (paymentMethod && paymentMethod === "PAYOS") {
      try {
        if (!showingId) {
          setAlertMessage(transWithFallback('noShowing', 'Không tìm thấy id của suất diễn'));
          setAlertOpen(true);
          return;
        }

        const res = await checkoutPayment({
          showingID: showingId,
          paymentMethod,
          paymentSuccessUrl: process.env.NODE_ENV === 'development'
            ? `http://${process.env.NEXT_PUBLIC_URL}/event/${event.id}/booking/payment/payment-success`
            : `${process.env.NEXT_PUBLIC_API_URL}/event/${event.id}/booking/payment/payment-success`,
          paymentCancelUrl: window.location.href
        }, session?.user?.accessToken || "");

        if (res.statusCode === 200) {
          window.location.href = res.data.paymentLink;
        }
        else {
          setAlertMessage(transWithFallback('errorCheckout', 'Lỗi khi thanh toán vé'));
          setAlertOpen(true);
        }
      } catch (error: any) {
        console.error('Lỗi khi thanh toán vé:', error);
        setAlertMessage(error.toString());
        setAlertOpen(true);
      }
    }
  }

  const handleClose = async () => {
    if (!redisInfo) {
      setOpenUnselectSeatDialog(false);
      return;
    }

    try {
      const res = await unselectSeat(showingId ?? "", session?.user?.accessToken || "");
      if (res?.statusCode === 200) {
        setOpenUnselectSeatDialog(false);
      } else {
        setAlertMessage(transWithFallback('errorUnselectSeat', 'Lỗi khi hủy chọn vé'));
        setAlertOpen(true);
      }
    } catch (error: any) {
      console.error('Lỗi khi gọi API lock-seat:', error);
      setAlertMessage(error.toString());
      setAlertOpen(true);
    }
  }

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    if (!msg || msg.startsWith('common.')) return fallback;
    return msg;
  };

  return (
    <div className="col-5 border-start" style={{ borderLeft: '1px solid #ddd' }}>
      <div className='container'>
        <p className='title-event'>{transWithFallback('eventDetail', 'Chi tiết sự kiện')}</p>
        <div className='row mt-3 text-start'>
          <div className="col-md-4">
            <Image
              src={`${event?.imgPosterUrl ?? ''}` || '/images/event.png'}
              width={165}
              height={110}
              alt="Image of event"
              style={{ width: "165px", height: "76px", objectFit: "cover" }}
            />
          </div>
          {event ? (
            <div className="col-md-8">
              <p className='d-flex justify-content-start'>{event.title}</p>
              <p className='d-flex justify-content-start'>
                <i className="bi bi-geo-alt mr-2"></i>
                {event.venue}
              </p>
              <p className='d-flex justify-content-start'>
                <i className="bi bi-calendar2-event mr-2"></i>
                {new Date(event?.startDate).toLocaleString(locale === "vi" ? 'vi-VN' : 'en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          ) : (
            <p>{transWithFallback('loading', 'Đang tải dữ liệu')}</p>
          )}
        </div>
        <hr className="custom-hr" />
        <div className='row'>
          <div className="col-md-8 d-flex justify-content-start">
            <p className='title-info'>{transWithFallback('bookedTicketInfo', 'Thông tin đặt vé')}</p>
          </div>
          {event && (
            <div className="col-md-4 d-flex justify-content-end">
              <p style={{ cursor: 'pointer', color: '#007bff' }} onClick={() => setOpenUnselectSeatDialog(true)}>
                {transWithFallback('reBookTicket', 'Chọn lại vé')}
              </p>
            </div>
          )}
        </div>
        <div className='row' style={{ fontWeight: 'bold' }}>
          <div className="col-md-6 d-flex justify-content-start">
            <p>{transWithFallback('ticketType', 'Loại vé')}</p>
          </div>
          <div className="col-md-3 d-flex justify-content-end">
            <p>{transWithFallback('quantity', 'Số lượng')}</p>
          </div>
          <div className="col-md-3 d-flex justify-content-end">
            <p>{transWithFallback('totalAmount', 'Thành tiền')}</p>
          </div>
        </div>
        {
          Object.entries(selectedTickets)
            .filter(([_, info]) => info.quantity > 0)
            .map(([ticketTypeId, info]) => {
              const type = ticketType.find(t => t.id === ticketTypeId);
              return (
                <div key={ticketTypeId} className='row'>
                  <div className="col-md-6 d-flex justify-content-start">
                    <p className='text-start'>
                      <span style={{ display: "block", fontWeight: 600 }}>{type?.name}</span>
                      {info.seatIds && info.seatIds.length > 0 && (
                        <span style={{ display: "block", fontSize: 13, color: "#666" }}>
                          {transWithFallback('bookedSeat', 'Ghế đã đặt')}: {info.name.join(", ")}
                        </span>
                      )}
                      <span style={{ display: "block", fontSize: 13 }}>
                        {transWithFallback('ticketPrice', 'Giá vé')}: {type?.price?.toLocaleString("vi-VN")}đ
                      </span>
                    </p>
                  </div>
                  <div className="col-md-3 d-flex justify-content-end">
                    <p>{info.quantity}</p>
                  </div>
                  <div className="col-md-3 d-flex justify-content-end">
                    <p>{((type?.price || 0) * info.quantity).toLocaleString("vi-VN")}đ</p>
                  </div>
                </div>
              );
            })
        }
        <hr className="custom-hr" />
        <div className='row pt-2 pb-3'>
          <div className="col-md-8 d-flex justify-content-start">
            <p>{transWithFallback('subtotal', 'Tạm tính')}</p>
          </div>
          <div className="col-md-4 d-flex justify-content-end">
            <p>{totalAmount?.toLocaleString("vi-VN")}đ</p>
          </div>
        </div>

        <div className='row pt-2 pb-3'>
          <div className="col-md-8 d-flex justify-content-start">
            <p style={{ color: '#0C4762' }} className='fw-bold'>Tổng tiền</p>
          </div>
          <div className="col-md-4 d-flex justify-content-end">
            <p style={{ color: '#0C4762' }} className='fw-bold'>{totalAmount.toLocaleString("vi-VN")}đ</p>
          </div>
        </div>

        <div className='row mt-2 mb-4'>
          <p>Bằng việc tiến hành đặt mua</p><br />
          <p>Bạn đã đồng ý với các <a href='#' style={{ color: '#0C4762', textDecoration: 'underline' }}>Điều Kiện Giao Dịch Chung</a></p>
        </div>
        <div className='row'>
          <button onClick={handlePayment} className='h-11 rounded bg-[#51DACF] text-[#0C4762] font-bold hover:bg-[#3BB8AE]'>Thanh toán</button>
        </div>
      </div>
      <ConfirmDialog
        open={openUnselectSeatDialog}
        onClose={handleClose}
        id={event?.id}
        showingId={showingId ?? ""}
        seatMapId={seatMapId}
      />
      <AlertDialog
        message={alertMessage}
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
      />
    </div>
  )
}