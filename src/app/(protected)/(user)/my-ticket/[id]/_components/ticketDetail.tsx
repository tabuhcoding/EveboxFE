'use client';

/* Package System */
import { ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

/* Package Application */
import { TicketDetailProps } from '@/types/models/ticket/ticketInfoById';

import { useTicketById } from '../../_component/libs/hooks/useTicketById';
import TicketDetailLoading from '../loading';
import GiftTicketModal from './giftTicketModal';

const TicketDetailClient = ({ ticketId }: TicketDetailProps) => {
    const { ticket, loading, error } = useTicketById(ticketId);
    const [currentTicketIndex, setCurrentTicketIndex] = useState(0);
    const router = useRouter();
    const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);

    const t = useTranslations('common');

    const transWithFallback = (key: string, fallback: string) => {
        const msg = t(key);
        if (!msg || msg.startsWith('common.')) return fallback;
        return msg;
    };


    if (loading) {
        return <TicketDetailLoading />;
    }

    if (error || !ticket) {
        return <div className="text-white text-center">{transWithFallback('notFoundTicket', 'Không tìm thấy vé')}</div>;
    }

    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'CANCELED': return { text: transWithFallback('orderCancelled', 'Đã hủy'), color: 'text-red-500' };
            case 'SUCCESS': return { text: transWithFallback('orderSuccess', 'Thành công'), color: 'text-green-500' };
            case 'PENDING': return { text: transWithFallback('orderPending', 'Đang chờ xử lý'), color: 'text-yellow-500' };
            default: return { text: 'Không xác định', color: 'text-white' };
        }
    };

    if (!ticket) {
        return <div className="text-white text-center">{transWithFallback('notFoundTicket', 'Không tìm thấy vé')}</div>;
    }

    const { text, color } = getStatusInfo(ticket.status);

    // const allTickets = ticket.TicketQRCode || [];
    const allTickets = ticket.Ticket
        ? ticket.Ticket.flatMap(t => t.tickets || [])
        : [];

    const totalTickets = allTickets.length;
    const currentTicket = allTickets[currentTicketIndex];

    let seatInfo = { section: "-", seat: "-" };

    if (currentTicket) {
        seatInfo = {
            section: currentTicket.sectionname || "-",
            seat: currentTicket.seatname || "-"
        };
    }

    return (
        <div className="ticket-detail mt-8 mb-10 min-h-screen flex justify-center items-center px-4">
            <div className="flex flex-col md:flex-row gap-4 w-full">
                <button
                    onClick={() => router.back()}
                    className="p-2 border-2 border-[#0C4762] rounded-md hover:bg-gray-200 absolute top-10 left-4 mt-10 mb-10"
                >
                    <ChevronLeft size={20} />
                </button>
                {/* Ticket Details */}
                <div className="bg-[#0C4762] text-white md:w-1/2 w-full p-6 rounded-lg shadow-lg mt-10">
                    <h2 className="text-lg font-bold mb-4 text-gray-300">{ticket.Showing?.title}</h2>

                    <div className="w-full rounded-lg overflow-hidden border border-white">
                        <Image
                            src={ticket.Showing?.imageUrl || "/images/event.png"}
                            alt="Poster"
                            width={700}
                            height={300}
                            className="w-full"
                        />
                    </div>

                    <div className="mt-4 grid grid-cols-[1.1fr_1.1fr_1fr_1.5fr] gap-x-4">
                        <div>
                            <p className="text-sm text-gray-300">{transWithFallback('ticketType', 'Loại vé')}</p>
                            <p className="text-[#9EF5CF] font-semibold">{ticket.type}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-300">{transWithFallback('area', 'Khu vực')}</p>
                            <p className="text-[#9EF5CF] font-semibold">{seatInfo.section}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-300">{transWithFallback('rowSeat', 'Hàng - Ghế')}</p>
                            <p className="text-[#9EF5CF] font-semibold">{seatInfo.seat}</p>
                        </div>
                        <div className='ml-auto text-left'>
                            <p className="text-sm text-gray-300">{transWithFallback('timeTitle', 'Thời gian')}</p>
                            <p className="text-[#9EF5CF] font-semibold">
                                {new Date(ticket.Showing?.startTime || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(ticket.Showing?.endTime || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                            <p className="text-[#9EF5CF] font-semibold">
                                {new Date(ticket.Showing?.startTime || '').toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    {/* Điều hướng giữa các vé */}
                    {totalTickets > 1 && (
                        <div className="flex justify-between mt-8">
                            <button
                                className="bg-[#51DACF] text-[#0C4762] px-4 py-2 rounded-lg disabled:opacity-50"
                                onClick={() => setCurrentTicketIndex((prev) => Math.max(0, prev - 1))}
                                disabled={currentTicketIndex === 0}
                            >
                                {transWithFallback('previous', 'Trước')}
                            </button>
                            <span className="flex items-center justify-center">{transWithFallback('ticket', 'Vé')} {currentTicketIndex + 1} / {totalTickets}</span>
                            <button
                                className="bg-[#51DACF] text-[#0C4762] px-4 py-2 rounded-lg disabled:opacity-50"
                                onClick={() => setCurrentTicketIndex((prev) => Math.min(totalTickets - 1, prev + 1))}
                                disabled={currentTicketIndex === totalTickets - 1}
                            >
                                {transWithFallback('next', 'Sau')}
                            </button>
                        </div>
                    )}
                </div>

                {/* Order Details */}
                <div className="bg-[#0C4762] text-white md:w-1/2 w-full p-6 rounded-lg shadow-lg mt-10">
                    <div className="bg-[#083A4F] p-4 rounded-lg">
                        <h3 className="text-lg font-bold mb-2">{transWithFallback('orderInfo', 'Thông tin đơn hàng')}</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <p className="text-gray-300">{transWithFallback('orderDated', 'Ngày đặt hàng:')}</p>
                            <p className="text-[#9EF5CF]">{new Date(ticket.PaymentInfo?.paidAt || ticket.createdAt || '').toLocaleString()}</p>
                            <p className="text-gray-300">{transWithFallback('paymentMethod', 'Phương thức thanh toán')}:</p>
                            <p className="text-[#9EF5CF]">{ticket.PaymentInfo?.method || transWithFallback('free', 'Miễn phí')}</p>
                            <p className="text-gray-300">{transWithFallback('owner', 'Chủ sở hữu')}:</p>
                            <p className="text-[#9EF5CF]">{ticket.ownerId}</p>
                            <p className="text-gray-300">{transWithFallback('orderStatus', 'Tình trạng đơn hàng')}:</p>
                            <p className={`${color} font-bold`}>{text}</p>
                        </div>
                    </div>

                    <div className="mt-4 bg-[#083A4F] p-4 rounded-lg">
                        <h3 className="text-lg font-bold mb-2">{transWithFallback('buyerInfo', 'Thông tin người mua')}</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            {ticket?.formResponse?.length ? (
                                ticket.formResponse.map((answer, index) => (
                                    <div key={index} className="contents">
                                        <p className="text-gray-300">{answer.fieldName}:</p>
                                        <p className="text-[#9EF5CF]">{answer.value || "-"}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-300 col-span-2">{transWithFallback('noBuyerInfo', 'Không có thông tin người mua.')}</p>
                            )}
                        </div>
                    </div>

                    <div className="mt-4 bg-[#083A4F] p-4 rounded-lg">
                        <h3 className="text-lg font-bold mb-2">{transWithFallback('paymentDetails', 'Chi tiết thanh toán')}</h3>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                            <p className="text-gray-300">{transWithFallback('ticketType', 'Loại vé')}</p>
                            <p className="text-gray-300 text-center">{transWithFallback('quantity', 'Số lượng')}</p>
                            <p className="text-gray-300 text-right">{transWithFallback('totalAmount', 'Thành tiền')}</p>
                            <p className="text-[#9EF5CF]">{ticket.Ticket[0]?.name}</p>
                            <p className="text-[#9EF5CF] text-center">{ticket.count}</p>
                            <p className="text-[#9EF5CF] text-right">{(ticket.price * ticket.count).toLocaleString()} đ</p>
                        </div>
                        <div className="border-t border-gray-400 mt-2 pt-2 text-sm">
                            <p className="text-gray-300 flex justify-between">
                                {transWithFallback('subTotal', 'Tổng tạm tính:')}
                                <span className="text-[#9EF5CF]">{(ticket.price * ticket.count).toLocaleString()} đ</span>
                            </p>
                            <p className="text-white flex justify-between font-bold text-lg mt-2">
                                {transWithFallback('total', 'Tổng tiền:')}
                                <span className="text-[#00FF00]">{(ticket.price * ticket.count).toLocaleString()} đ</span>
                            </p>
                        </div>
                    </div>

                    {ticket.status === 'SUCCESS' && ticket.canGiveAway && (
                        <>
                            <div className="mt-8">
                                <button
                                    className="w-full bg-[#51DACF] hover:bg-[#3ec8bd] text-[#0C4762] font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-200"
                                    onClick={() => setIsGiftModalOpen(true)}
                                >
                                    {transWithFallback('giveAway', 'Tặng vé')}
                                </button>
                            </div>
                            <GiftTicketModal
                                isOpen={isGiftModalOpen}
                                onClose={() => setIsGiftModalOpen(false)}
                                ticketId={ticket.id}
                            />
                        </>
                    )}
                </div>
            </div>
        </div >
    );
};

export default TicketDetailClient;
