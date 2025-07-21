'use client';

/* Package System */
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'tailwindcss/tailwind.css';

/* Package Application */
import AlertDialog from '@/components/common/alertDialog';
import { getRedisSeat } from '@/services/booking.service';
import { getFormOfShowing } from '@/services/event.service';
import { IFormInput } from '@/types/models/event/booking/questionForm.interface';
import { TicketType, EventProps, SelectedTicketsState } from '@/types/models/event/booking/seatmap.interface';
import { RedisInfo } from '@/types/models/event/redisSeat';

import CountdownTimer from '../../_components/countdownTimer';
import Navigation from '../../_components/navigation';

import QuestionList from './questionList';
import TicketInformation from './ticketInfo';

import '@/styles/admin/pages/Dashboard.css';
import '@/styles/admin/pages/BookingQuestionForm.css';

export default function QuestionFormPage({ showingId, seatMapId }: { showingId: string, seatMapId: number }) {
  const t = useTranslations('common');

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // Các state cho event/ticket mới
  const [event, setEvent] = useState<EventProps | null>(null);
  const [selectedTickets, setSelectedTickets] = useState<SelectedTicketsState>({});
  const [ticketType, setTicketType] = useState<TicketType[]>([]);
  const [totalTickets, setTotalTickets] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [formId, setFormId] = useState<number | null>(null);
  const [formInputs, setFormInputs] = useState<IFormInput[]>([]);
  const [formAnswers, setFormAnswers] = useState<{ [formInputId: number]: string }>({});
  const [redisSeatInfo, setRedisSeatInfo] = useState<RedisInfo | null>(null);
  const [isLoadingForm, setIsLoadingForm] = useState(true);
  const [allRequiredFilled, setAllRequiredFilled] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const fetchForm = async () => {
      setIsLoadingForm(true);

      try {
        const response = await getFormOfShowing(showingId);

        if (response?.statusCode === 200) {
          setFormId(response.data.id);
          setFormInputs(response.data.FormInput);
        } else {
          setFormId(null);
          setFormInputs([]);
        }
      } catch (error: any) {
        console.error('Lỗi khi gọi API lock-seat:', error);
        // setAlertMessage(transWithFallback("errorLockSeat", "Lỗi khi khóa ghế. Vui lòng thử lại sau."));
        setFormId(null);
        setFormInputs([]);
      } finally {
        setIsLoadingForm(false);
      }
    }

    if (showingId) {
      fetchForm();
    }
  }, [showingId]);

  useEffect(() => {
    const fetchRedisSeat = async () => {
      try {
        const res = await getRedisSeat(showingId);

        if (res?.statusCode === 200) {
          setRedisSeatInfo(res.data);
        }
        else {
          setAlertMessage(transWithFallback('errorGetRedisSeat', 'Lỗi khi lấy thông tin từ redis'));
          setAlertOpen(true);
        }
      } catch (error: any) {
        console.error('Lỗi khi gọi lấy thông tin từ redis:', error);
        // setAlertMessage(transWithFallback("errorLockSeat", "Lỗi khi khóa ghế. Vui lòng thử lại sau."));
        setAlertMessage(error.toString());
        setAlertOpen(true);
      }
    }

    if (showingId) {
      fetchRedisSeat();
    }
  }, [showingId]);

  useEffect(() => {
    // Lấy dữ liệu từ localStorage - version mới
    const storedEvent = localStorage.getItem('event');
    const storedTotalTickets = localStorage.getItem('totalTickets');
    const storedTotalAmount = localStorage.getItem('totalAmount');
    const storedTicketTypeArr = localStorage.getItem('ticketTypeArr'); // Array các loại vé
    const storedSelectedTickets = localStorage.getItem('selectedTickets'); // Object {ticketTypeId: {...}}

    if (storedEvent) setEvent(JSON.parse(storedEvent));
    if (storedTotalTickets) setTotalTickets(Number(storedTotalTickets));
    if (storedTotalAmount) setTotalAmount(Number(storedTotalAmount));
    // Lưu ý: cần phải lưu mảng ticketTypeArr vào localStorage từ page trước!
    if (storedTicketTypeArr) setTicketType(JSON.parse(storedTicketTypeArr));
    if (storedSelectedTickets) setSelectedTickets(JSON.parse(storedSelectedTickets));
  }, []);

  useEffect(() => {
    // Tổng số lượng và tổng tiền phải tự tính lại từ selectedTickets/ticketType
    const totalQty = Object.values(selectedTickets).reduce((sum, t) => sum + (t.quantity || 0), 0);
    setTotalTickets(totalQty);

    const totalAmt = Object.entries(selectedTickets).reduce((sum, [ticketTypeId, info]) => {
      const type = ticketType.find(t => t.id === ticketTypeId);
      return sum + (type?.price || 0) * (info.quantity || 0);
    }, 0);
    setTotalAmount(totalAmt);
  }, [selectedTickets, ticketType]);

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    if (!msg || msg.startsWith('common.')) return fallback;
    return msg;
  };

  return (
    <>
      <div className="mt-5 mb-5">
        <Navigation title={`${t("questionForm") || 'Bảng câu hỏi'}`} />

        <div className="fixed top-10 right-10 mt-4 z-10">
          <CountdownTimer expiredTime={redisSeatInfo?.expiredTime ? redisSeatInfo?.expiredTime : 0} />
        </div>

        <div className="px-4 sm:px-6 md:px-10 lg:px-20 xl:px-32 py-0">
          <div className="row align-items-start mt-4">
            <QuestionList
              formInputs={formInputs}
              onValidationChange={setIsFormValid}
              onFormChange={setFormAnswers}
              isLoadingForm={isLoadingForm}
              onRequiredFilledChange={setAllRequiredFilled}
            />
            <TicketInformation
              event={event}
              totalTickets={totalTickets}
              totalAmount={totalAmount}
              isFormValid={isFormValid && (allRequiredFilled || formId === null)}
              selectedTickets={selectedTickets}
              ticketType={ticketType}
              formData={formAnswers}
              formId={formId}
              showingId={showingId}
              redisInfo={redisSeatInfo}
              seatMapId={seatMapId}
            />
          </div>
        </div>
      </div>
      <AlertDialog
        message={alertMessage}
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
      />
    </>
  );
}