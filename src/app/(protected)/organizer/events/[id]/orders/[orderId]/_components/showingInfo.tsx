/* Package System */
import Image from "next/image";
import { useTranslations } from "next-intl";

/* Package Application */
import { OrderShowingResponse } from "@/types/models/event/booking/payment.interface";

export default function ShowingInfo({ showing }: { showing: OrderShowingResponse }) {
  const t = useTranslations('common');
  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    if (!msg || msg.startsWith('common.')) return fallback;
    return msg;
  };

  return (
    <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-xl shadow-lg p-6 mb-6 gap-5">
      <div className="md:w-1/3 flex-shrink-0 flex justify-center items-center">
        <Image
          src={showing?.imageUrl || "/images/event.png"}
          alt="Event Ticket"
          width={380}
          height={250}
          className="rounded-lg object-cover"
        />
      </div>
      <div className="md:w-2/3 flex flex-col justify-center gap-2">
        <h3 className="font-bold text-xl mb-1">{showing.title}</h3>
        <div><b>{transWithFallback('location', 'Địa điểm')}:</b> {showing.venue}</div>
        <div><b>{transWithFallback('address', 'Địa chỉ')}:</b> {showing.locationsString.replace(/"/g, '')}</div>
        <div>
          <b>{transWithFallback('time', 'Thời gian')}:</b>{" "}
          {showing.startTime
            ? new Date(showing.startTime).toLocaleString("vi-VN")
            : ""}{" "}
          -{" "}
          {showing.endTime
            ? new Date(showing.endTime).toLocaleString("vi-VN")
            : ""}
        </div>
      </div>
    </div>
  );
}
