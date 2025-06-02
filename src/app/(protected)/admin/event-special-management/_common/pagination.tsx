'use client'

/* Package Application */
import { PaginationProps } from "services/interface/eventSpecialTable";

export default function Pagination({ currentPage, totalItems, itemsPerPage, onPrevious, onNext } : PaginationProps) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const startItem = totalItems === 0 ? 0 : startIndex + 1;
    const endItem = Math.min(startIndex + itemsPerPage, totalItems);

    return (
        <>
            {/* Phân trang */}
            <div className="paging-event-special flex items-center justify-between mt-4 px-2 text-sm text-gray-500">
                <p>Hiển thị {startItem}-{endItem} của {totalItems}</p>

                <div className="inline-flex items-center rounded-full border border-gray-300 overflow-hidden">
                    {/* Nút Previous */}
                    <button
                        onClick={onPrevious} 
                        disabled={currentPage === 1}
                        className={`w-8 h-8 flex items-center justify-center 
                                    ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <div className="h-6 w-px bg-gray-300" />

                    {/* Nút Next */}
                    <button
                        onClick={onNext} 
                        disabled={currentPage === totalPages}
                        className={`w-8 h-8 flex items-center justify-center 
                                    ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-800 hover:bg-gray-100'}`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </>
    )
}