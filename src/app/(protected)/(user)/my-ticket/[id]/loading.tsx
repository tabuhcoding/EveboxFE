import { ChevronLeft } from 'lucide-react';
import React from 'react';

export default function TicketDetailLoading() {
    return (
        <div className="ticket-detail mt-8 mb-10 min-h-screen flex justify-center items-center px-4">
            <div className="flex flex-col md:flex-row gap-4 w-full relative animate-pulse">
                {/* Nút back */}
                <button
                    className="p-2 border-2 border-[#0C4762] rounded-md absolute top-10 left-4 mt-10 mb-10"
                >
                    <ChevronLeft size={20} />
                </button>

                {/* Ticket Info Skeleton */}
                <div className="bg-[#0C4762] md:w-1/2 w-full p-6 rounded-lg shadow-lg mt-10 space-y-4">
                    <div className="h-6 bg-gray-500 rounded w-1/3" />
                    <div className="w-full h-[180px] bg-gray-600 rounded" />

                    <div className="mt-4 grid grid-cols-[1.1fr_1.1fr_1fr_1.5fr] gap-x-4">
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-400 w-3/4 rounded" />
                            <div className="h-5 bg-gray-300 w-1/2 rounded" />
                        </div>
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-400 w-3/4 rounded" />
                            <div className="h-5 bg-gray-300 w-1/2 rounded" />
                        </div>
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-400 w-3/4 rounded" />
                            <div className="h-5 bg-gray-300 w-1/2 rounded" />
                        </div>
                        <div className="space-y-2 ml-auto text-left">
                            <div className="h-4 bg-gray-400 w-1/2 rounded" />
                            <div className="h-5 bg-gray-300 w-3/4 rounded" />
                            <div className="h-5 bg-gray-300 w-2/3 rounded" />
                        </div>
                    </div>

                    {/* Điều hướng vé */}
                    <div className="flex justify-between mt-8">
                        <div className="h-10 bg-[#51DACF] w-[100px] rounded-lg" />
                        <div className="h-6 bg-gray-300 w-[80px] rounded" />
                        <div className="h-10 bg-[#51DACF] w-[100px] rounded-lg" />
                    </div>
                </div>

                {/* Order Info Skeleton */}
                <div className="bg-[#0C4762] md:w-1/2 w-full p-6 rounded-lg shadow-lg mt-10 space-y-6">
                    {/* Thông tin đơn hàng */}
                    <div className="bg-[#083A4F] p-4 rounded-lg space-y-2">
                        <div className="h-5 bg-gray-500 w-1/2 rounded" />
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            {Array.from({ length: 3 }).map((_, idx) => (
                                <React.Fragment key={idx}>
                                    <div className="h-4 bg-gray-400 rounded w-3/4" />
                                    <div className="h-4 bg-gray-300 rounded w-3/4" />
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    {/* Thông tin người mua */}
                    <div className="bg-[#083A4F] p-4 rounded-lg space-y-2">
                        <div className="h-5 bg-gray-500 w-1/2 rounded" />
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            {Array.from({ length: 3 }).map((_, idx) => (
                                <React.Fragment key={idx}>
                                    <div className="h-4 bg-gray-400 rounded w-3/4" />
                                    <div className="h-4 bg-gray-300 rounded w-3/4" />
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    {/* Chi tiết thanh toán */}
                    <div className="bg-[#083A4F] p-4 rounded-lg space-y-2">
                        <div className="h-5 bg-gray-500 w-1/2 rounded" />
                        <div className="grid grid-cols-3 gap-2 text-sm">
                            <div className="h-4 bg-gray-400 rounded" />
                            <div className="h-4 bg-gray-400 rounded" />
                            <div className="h-4 bg-gray-400 rounded" />

                            <div className="h-4 bg-gray-300 rounded" />
                            <div className="h-4 bg-gray-300 rounded" />
                            <div className="h-4 bg-gray-300 rounded" />
                        </div>
                        <div className="border-t border-gray-400 pt-2">
                            <div className="flex justify-between text-sm">
                                <div className="h-4 bg-gray-400 w-1/3 rounded" />
                                <div className="h-4 bg-gray-300 w-1/3 rounded" />
                            </div>
                            <div className="flex justify-between font-bold text-lg mt-2">
                                <div className="h-5 bg-gray-400 w-1/4 rounded" />
                                <div className="h-5 bg-[#00FF00] w-1/4 rounded" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
