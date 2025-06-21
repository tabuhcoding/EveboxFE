'use client';

/* Package System */
import Image from 'next/image';
import { useRouter } from "next/navigation";
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';

/* Package Application */
import AlertDialog from '@/components/common/alertDialog';
import { submitForm, unselectSeat } from '@/services/booking.service';
import { TicketInformationProps } from 'types/models/event/booking/questionForm.interface';

import ConfirmDialog from './confirmDialog';

export default function TicketInformation({
  event, totalTickets, totalAmount, isFormValid,
  selectedTickets, ticketType, formData, showingId, formId, redisInfo, seatMapId
}: TicketInformationProps) {
  console.log("🚀 ~ totalTickets:", totalTickets)
  const t = useTranslations('common');
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const { data: session } = useSession();
  const router = useRouter();

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    if (!msg || msg.startsWith('common.')) return fallback;
    return msg;
  };

  const handleClose = async () => {
    if (!redisInfo) {
      setOpenDialog(false);
      return;
    }

    try {
      const res = await unselectSeat(showingId ?? "", session?.user?.accessToken || "");
      if (res?.statusCode === 200) {
        setOpenDialog(false);
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

  const handlePayment = async () => {
    if (!session?.user?.accessToken || !event || !formId || !showingId) return;

    setLoading(true);

    try {
      const answers = Object.entries(formData).map(([formInputId, value]) => ({
        formInputId: Number(formInputId),
        value,
      }));
      const res = await submitForm({
        formId: Number(formId),
        showingId,
        answers
      }, session?.user?.accessToken);

      if (res.statusCode === 200) {
        localStorage.setItem('submittedForm', JSON.stringify(formData));

        if (seatMapId && seatMapId !== 0) {
          router.push(`/event/${event.id}/booking/payment?showingId=${showingId}&seatMapId=${seatMapId}`);
        }
        else router.push(`/event/${event.id}/booking/payment?showingId=${showingId}`);
      } else {
        setAlertMessage(transWithFallback('errorSubmitForm', 'Lỗi khi gửi form đi'));
        setAlertOpen(true);
      }
    } catch (error: any) {
      console.error('Lỗi khi gọi API submit form:', error);
      setAlertMessage(error.toString());
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  }

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
                {new Date(event?.startDate).toLocaleString('vi-VN', {
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
              <p style={{ cursor: 'pointer', color: '#007bff' }} onClick={() => setOpenDialog(true)}>
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
        <div className='row'>
          <div className="col-md-8 d-flex justify-content-start">
            <p>{transWithFallback('subtotal', 'Tạm tính')}</p>
          </div>
          <div className="col-md-4 d-flex justify-content-end">
            <p>{totalAmount?.toLocaleString("vi-VN")}đ</p>
          </div>
        </div>
        <div className='row mt-2 mb-4'>
          <p>{transWithFallback('ansAllToCont', 'Vui lòng trả lời tất cả câu hỏi để tiếp tục')}</p>
        </div>
        <div className='row'>
          <button
            onClick={handlePayment}
            className={isFormValid ? 'h-11 rounded bg-[#51DACF] text-[#0C4762] font-bold hover:bg-[#3BB8AE]' : 'btn-order-disable'}
            disabled={!isFormValid || loading}
          >
            {loading ? (
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">{transWithFallback('loading', 'Đang tải')}</span>
              </div>
            ) : (
              `${transWithFallback('checkout', 'Thanh toán')} - ${totalAmount.toLocaleString("vi-VN")}đ`
            )}
          </button>
        </div>
      </div>
      <ConfirmDialog 
        open={openDialog} 
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
  );
}

