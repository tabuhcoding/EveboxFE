/* Package System */
import { useTranslations } from 'next-intl';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'tailwindcss/tailwind.css';
import { useState } from 'react';

/* Package Application */
import { SelectTicketProps } from "types/models/event/booking/selectTicket.interface";

export default function SelectTicket({
  tickets,
  selectedTickets,
  setSelectedTickets,
  selectedTicket,
  setSelectedTicket
}: SelectTicketProps) {
  const t = useTranslations("common");
  // const [alertOpen, setAlertOpen] = useState(false);
  // const [alertMessage, setAlertMessage] = useState("");

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    if (!msg || msg.startsWith('common.')) return fallback;
    return msg;
  };

  const [expandedDescriptions, setExpandedDescriptions] = useState<{ [key: string]: boolean }>({});

  const toggleDescription = (id: string) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleIncrease = (id: string) => {
    // if (selectedTicket && selectedTicket !== id) {
    //   setAlertMessage(t("onlyOneTicketType") ?? "Bạn chỉ được mua 1 loại vé duy nhất.");
    //   setAlertOpen(true);
    //   return;
    // }

    const currentQty = selectedTickets[id]?.quantity || 0;
    const ticket = tickets.find(t => t.id === id);
    if (ticket && currentQty >= ticket.maxQtyPerOrder) return;

    setSelectedTickets((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] || {}),
        quantity: (prev[id]?.quantity || 0) + 1,
      }
    }));
  };

  const handleDecrease = (id: string) => {
    setSelectedTickets((prev) => {
      if (prev[id]?.quantity && prev[id].quantity > 0) {
        return {
          ...prev,
          [id]: { ...prev[id], quantity: prev[id].quantity - 1 }
        };
      }
      return prev;
    });
  };

  const handleSelect = (id: string) => {
    setSelectedTicket(id);
  };

  return (
    <>
      <div className="px-32 py-0">
        <hr className="mb-8 border-2 border-[#0C4762]" />

        <div className='ticket-container flex justify-center'>
          <div className='flex flex-wrap justify-center gap-4 max-w-full'>
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className={`w-[280px] border rounded-lg p-3 text-center cursor-pointer transition-all duration-300 bg-white flex flex-col
                            ${selectedTicket === ticket.id ? 'border-2 border-black shadow-[8px_8px_0px_0px_#0C4762]' : 'border-2 border-gray-800'}
                            ${!ticket.available ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => ticket.available && handleSelect(ticket.id)}
              >
                <div className='ticket-info'>
                  <h3 className='font-semibold text-xl break-words leading-snug min-h-[60px] line-clamp-2'
                    title={ticket.name}>
                    {ticket.name}
                  </h3>

                  {/* {ticket.description && ticket.description !== "" && (
                    <div className="bg-[#F4EEEE] text-gray-700 rounded-lg p-2 mt-2 text-sm text-left flex items-start">
                      <div className="flex items-center justify-center w-6 h-6 mr-2">
                        <i className="bi bi-exclamation-circle-fill text-orange-600"></i>
                      </div>
                      <p className="whitespace-pre-line">{ticket.description}</p>
                    </div>
                  )} */}

                  {ticket.description && ticket.description !== "" && (
                    <div className="bg-[#F4EEEE] text-gray-700 rounded-lg p-2 mt-2 text-sm text-left flex items-start relative">
                      <div className="flex items-center justify-center w-6 h-6 mr-2 mt-1">
                        <i className="bi bi-exclamation-circle-fill text-orange-600"></i>
                      </div>
                      <div className="flex-1 overflow-hidden min-h-[120px] flex flex-col justify-between">
                        <p className={`whitespace-pre-line transition-all duration-300 ${expandedDescriptions[ticket.id] ? '' : 'line-clamp-6'}`}>
                          {ticket.description}
                        </p>

                        {/* Dù không hiển thị, vẫn chiếm không gian */}
                        <div className="flex justify-center">
                          {ticket.description.length > 120 ? (
                            <button
                              onClick={() => toggleDescription(ticket.id)}
                              className="text-blue-600 text-xs underline hover:text-blue-800"
                            >
                              {expandedDescriptions[ticket.id] ? transWithFallback("showLess", "Thu gọn") : transWithFallback("showMore", "Xem thêm")}
                            </button>
                          ) : (
                            // Placeholder để chiếm chỗ tương đương với nút
                            <span className="invisible text-3xl">{transWithFallback("showMore", "Xem thêm")}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className='ticket-actions mt-auto'>
                  <p className="font-semibold mt-2">{ticket.price?.toLocaleString()}đ</p>

                  {ticket.available ? (
                    <div className='flex items-center justify-center mt-2'>
                      <button
                        className={`px-3 py-1 border rounded-l bg-gray-100 hover:bg-gray-200 ${selectedTickets[ticket.id] ? '' : 'opacity-50 cursor-not-allowed'}`}
                        onClick={() => handleDecrease(ticket.id)}
                        disabled={!selectedTickets[ticket.id]}
                      >-</button>
                      <span className="px-4 font-semibold">{selectedTickets[ticket.id]?.quantity || 0}</span>
                      <button
                        className={`px-3 py-1 border rounded-r bg-gray-100 hover:bg-gray-200 
                                  ${(selectedTickets[ticket.id]?.quantity || 0) >= ticket.maxQtyPerOrder ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={() => handleIncrease(ticket.id)}
                        disabled={
                          (selectedTickets[ticket.id]?.quantity || 0) >= ticket.maxQtyPerOrder
                        }
                      >+</button>
                    </div>
                  ) : (
                    <p className="text-red-500 mt-2 font-semibold">{transWithFallback('soldOut', 'Hết vé')}</p>
                  )}

                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* <AlertDialog
        message={alertMessage}
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
      /> */}
    </>
  );
}