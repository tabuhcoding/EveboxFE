/* Package System */
import { useTranslations } from "next-intl";

/* Package Application */
import { OrderTicketTypeResponse } from "@/types/models/event/booking/payment.interface";

export default function TicketResponseInfo({ ticketTypes }: { ticketTypes: OrderTicketTypeResponse[] }) {
  const t = useTranslations('common');
  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    if (!msg || msg.startsWith('common.')) return fallback;
    return msg;
  };

  return (
    <div className="mt-6">
      <h3 className="font-bold text-base mb-2">{transWithFallback('ticketInfo', 'Thông tin vé')}</h3>
      <div className="flex flex-col gap-3">
        {ticketTypes.map((ticketType) => (
          <div key={ticketType.id} className="pl-2">
            <li className="font-semibold">
              {ticketType.name} <span className="text-[#0C4762]">- {ticketType.price.toLocaleString("vi-VN")}đ</span>
            </li>
            {ticketType.tickets && ticketType.tickets.length > 0 && (
              <div className="pl-4 text-sm text-gray-700 list-disc">
                {ticketType.tickets.map((tk) => (
                  <span key={tk.id} className="my-1">
                    {tk.seatname ? <span><b>Ghế:</b> <span className="font-semibold">{tk.seatname}</span></span> : null}
                    {tk.sectionname ? <span> | <b>Khu:</b> <span className="font-semibold">{tk.sectionname}</span></span> : null}
                    {tk.description ? <span> ({tk.description})</span> : null}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
