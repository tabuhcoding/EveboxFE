'use client';

/* Package System */
import jsQR from 'jsqr';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

/* Package Application */
import { TicketDetailProps } from '@/types/models/ticket/ticketInfoById';
import { decrypt } from '@/utils/helpers';

import { useTicketById } from '../../_component/libs/hooks/useTicketById';

const TicketDetailClient = ({ ticketId }: TicketDetailProps) => {
    const { ticket, loading, error } = useTicketById(ticketId);
    const [currentTicketIndex, setCurrentTicketIndex] = useState(0);
    const [qrDecodedData, setQrDecodedData] = useState(null);
    // const router = useRouter();

    const t = useTranslations('common');

    const transWithFallback = (key: string, fallback: string) => {
        const msg = t(key);
        if (!msg || msg.startsWith('common.')) return fallback;
        return msg;
    };


    if (loading) {
        return <div className="text-white text-center">{transWithFallback('uploading', 'Đang tải...')}</div>;
    }

    if (error || !ticket) {
        return <div className="text-white text-center">{transWithFallback('notFoundTicket', 'Không tìm thấy vé')}</div>;
    }

    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'CANCELED': return { text: 'Đã hủy', color: 'text-red-500' };
            case 'SUCCESS': return { text: 'Thành công', color: 'text-green-500' };
            case 'PENDING': return { text: 'Đang chờ xử lý', color: 'text-yellow-500' };
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

    const handleDecodeQR = () => {
        if (!currentTicket || !currentTicket.qrCode) {
            alert(transWithFallback('notFoundQRData', 'Không tìm thấy dữ liệu QR.'));
            return;
        }
        const base64 = currentTicket.qrCode.startsWith('data:image')
            ? currentTicket.qrCode
            : `data:image/png;base64,${currentTicket.qrCode}`;

        const img = document.createElement('img');
        img.src = base64;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const qr = jsQR(imageData.data, imageData.width, imageData.height);
            if (qr) {
                try {
                    const encryptedText = qr.data;
                    const decryptedContent = decrypt(encryptedText);
                    const parsedData = JSON.parse(decryptedContent);
                    setQrDecodedData(parsedData);
                } catch (error) {
                    console.error(transWithFallback('errorDecodeQR', 'Lỗi khi giải mã hoặc parse QR:'), error);
                    alert(transWithFallback('errorDecodeQRAlert', 'Có lỗi xảy ra khi giải mã QR.'));
                }
            } else {
                alert(transWithFallback('notFoundQRData', 'Không tìm thấy dữ liệu QR.'));
            }
        };
        img.onerror = (event: string | Event) => {
            console.error(transWithFallback('errorLoadQRImage', 'Lỗi khi load ảnh QR:'), event);
        };
    }

    return (
        <div className="ticket-detail mt-8 mb-10 min-h-screen flex justify-center items-center px-4">
            <div className="flex flex-row gap-4 w-full">
                {/* Ticket Details */}
                <div className="bg-[#0C4762] text-white w-1/2 p-6 rounded-lg shadow-lg">
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

                    {/* QR Code */}
                    {currentTicket?.qrCode && currentTicket.qrCode !== "Unknow" && (
                        <div className="mt-6 flex justify-center">
                            <div className="bg-[#9EF5CF] p-2 rounded-lg flex flex-col items-center gap-2">
                                <span className="text-sm text-[#0C4762] font-semibold">{transWithFallback('qrCode', 'Mã QR vé')}</span>
                                <Image
                                    src={currentTicket.qrCode.startsWith('data:image') ? currentTicket.qrCode : `data:image/png;base64,${currentTicket.qrCode}`}
                                    alt="QR Code"
                                    width={100}
                                    height={100}
                                    className="border border-gray-400 rounded-lg"
                                />
                            </div>
                        </div>
                    )}

                    {/* Nút giải mã QR */}
                    <div className="mt-4 flex justify-center">
                        <button
                            onClick={handleDecodeQR}
                            className="bg-[#51DACF] text-[#0C4762] px-4 py-2 rounded-lg"
                        >
                            {transWithFallback('decodeQR', 'Giải mã QR')}
                        </button>
                    </div>
                    {/* Hiển thị dữ liệu giải mã được dưới dạng danh sách */}
                    {qrDecodedData && (
                        <div className="mt-4 bg-gray-800 p-4 rounded-lg">
                            <h3 className="text-white font-semibold mb-2">{transWithFallback('qrContent', 'Nội dung QR:')}</h3>
                            <ul className="text-white text-sm list-disc pl-5">
                                {Object.entries(qrDecodedData).map(([key, value]) => (
                                    <li key={key}>
                                        <strong>{key}:</strong> {String(value)}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Điều hướng giữa các vé */}
                    {totalTickets > 1 && (
                        <div className="flex justify-between mt-4">
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
                <div className="bg-[#0C4762] text-white w-1/2 p-6 rounded-lg shadow-lg">
                    <div className="bg-[#083A4F] p-4 rounded-lg">
                        <h3 className="text-lg font-bold mb-2">{transWithFallback('orderInfo', 'Thông tin đơn hàng')}</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <p className="text-gray-300">{transWithFallback('orderDated', 'Ngày đặt hàng:')}</p>
                            <p className="text-[#9EF5CF]">{new Date(ticket.PaymentInfo?.paidAt || '').toLocaleString()}</p>
                            <p className="text-gray-300">{transWithFallback('paymentMethod', 'Phương thức thanh toán')}:</p>
                            <p className="text-[#9EF5CF]">{ticket.PaymentInfo?.method}</p>
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
                </div>
            </div>
        </div >
    );
};

export default TicketDetailClient;
