'use client';

/* Package System */
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

/* Package Application */
import AlertDialog from "@/components/common/alertDialog";
import { getPaymentMethodStatus } from "@/services/payment.service";
import type { PaymentMethod, PaymentMethodProps } from "@/types/models/event/booking/payment.interface";

import '@/styles/event/payment.css';

export default function PaymentMethod({ onMethodSelected }: PaymentMethodProps) {
  const t = useTranslations('common');
  // const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [selectedMethod, setSelectedMethod] = useState("");

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [isLoadingMethods, setIsLoadingMethods] = useState(true);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  const [submittedAnswers, setSubmittedAnswers] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const submittedForm = localStorage.getItem('submittedForm');
    if (submittedForm) {
      setSubmittedAnswers(JSON.parse(submittedForm));
    }
  }, []);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      setIsLoadingMethods(true);
      try {
        const res = await getPaymentMethodStatus();

        if (res?.statusCode === 200) {
          setPaymentMethods(res?.data);
        }
        else {
          setAlertMessage(transWithFallback('errorGetPaymentMethodStatus', 'Lỗi khi lấy tình trạng của các phương thức thanh toán'));
          setAlertOpen(true);
        }
      } catch (error: any) {
        console.error('Lỗi khi gọi API get method status: ', error);
        setAlertMessage(error.toString());
        setAlertOpen(true);
      } finally {
        setIsLoadingMethods(false);
      }
    }

    fetchPaymentMethods();
  }, []);

  const handleSelectMethod = (method: string) => {
    setSelectedMethod(method);
    onMethodSelected(method);
  }

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    if (!msg || msg.startsWith('common.')) return fallback;
    return msg;
  };

  return (
    <>
      <div className="col-7">
        <div className="container bg-white rounded-lg p-4 shadow-lg">
          {/* Lưu ý cập nhật thông tin */}
          <div className="alert alert-info bg-alert text-sm d-flex align-items-center">
            <i className="bi bi-exclamation-circle mr-2"></i>
            {transWithFallback('checkReceiveInfo', 'Vui lòng kiểm tra thông tin nhận vé của bạn trước khi tiếp tục thanh toán.')}. {transWithFallback('anyChanges', 'Nếu bạn cần thực hiện bất kỳ thay đổi nào')}&nbsp;
            <a
              // onClick={handleOpenInfoDialog} 
              className="fw-bold text-primary cursor-pointer hover:underline"
            >
              {transWithFallback('pleaseClickHere', 'vui lòng nhấp vào đây để chỉnh sửa thông tin của bạn.')}
            </a>
          </div>

          {/* Thông tin nhận vé */}
          <div className="mt-3 flex flex-col items-start">
            <h2 className="fw-bold">{transWithFallback('ticketReceiveInfo', 'Thông tin nhận vé')}</h2>
            {Object.entries(submittedAnswers).map(([formInputId, value]) => (
              !value.includes("Tôi") && (
                <p key={formInputId} className="mb-1">{value}</p>
              )
            ))}
          </div>

          {/* Phương thức thanh toán */}
          <div className="mt-4 flex flex-col">
            <h4 className="fw-bold self-start">{transWithFallback('paymentMethod', 'Phương thức thanh toán')}</h4>
            <div className="rounded-lg mt-5">
              {!isLoadingMethods && paymentMethods?.map((method) => (
                method.status && (
                  <div
                    key={method.paymentMethod}
                    className={`d-flex align-items-center h-14 justify-content-between border rounded-lg pl-3 pr-3 mb-2 cursor-pointer transition-all duration-300 
                                ${selectedMethod === method.paymentMethod ? 'border-2 border-black shadow-[4px_4px_0px_0px_#0022BA]' : 'border-2 border-gray-300'}`}
                    onClick={() => handleSelectMethod(method.paymentMethod)}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.paymentMethod}
                        checked={selectedMethod === method.paymentMethod}
                        onChange={() => handleSelectMethod(method.paymentMethod)}
                        className="me-2"
                      />
                      <span className="fw-bold">{method.paymentMethod}</span>
                    </div>
                    <Image className={`method-img rounded-lg max-w-[107px] justify-end max-h-[38px] object-contain`} src={`/images/${method.paymentMethod}-logo.svg`} alt={method.paymentMethod} width={107} height={21.5} />
                  </div>
                )
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* <PaymentInfoDialog open={isDialogOpen} user={user} onClose={handleOpenInfoDialog} /> */}
      <AlertDialog
        message={alertMessage}
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
      />
    </>
  )
}