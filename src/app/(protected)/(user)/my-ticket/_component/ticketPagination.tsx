/* Package System */
import { useTranslations } from 'next-intl';

/* Package Application */
import { TicketPaginationProps } from '@/types/models/ticket/ticketInfo';

export default function TicketPagination({ currentPage, totalPages, ticketsPerPage, onPageChange, setTicketsPerPage }: TicketPaginationProps) {
    const t = useTranslations('common');

    const transWithFallback = (key: string, fallback: string) => {
        const msg = t(key);
        return !msg || msg.startsWith('common.') ? fallback : msg;
    };

    const getPageNumbers = (): (number | string)[] => {
        const maxVisible = 3;
        const pages: (number | string)[] = [];

        if (totalPages <= maxVisible + 2) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            const showLeft = currentPage <= maxVisible;
            const showRight = currentPage >= totalPages - maxVisible + 1;

            if (showLeft) {
                for (let i = 1; i <= maxVisible; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (showRight) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - maxVisible + 1; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                pages.push(currentPage - 1);
                pages.push(currentPage);
                pages.push(currentPage + 1);
                pages.push('...');
                pages.push(totalPages);
            }
        }
        return pages;
    };

    return (
        <div className="flex flex-col items-center gap-4 mb-10">
            <div className="flex items-center gap-2">
                <label className="text-sm">{transWithFallback('numTicketPage', 'Số vé/trang:')}</label>
                <select
                    className="px-2 py-1 border rounded"
                    value={ticketsPerPage}
                    onChange={(e) => setTicketsPerPage(Number(e.target.value))}
                >
                    {[10, 20, 50].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
            </div>
            <div className="flex flex-wrap gap-2">
                <button
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                    className="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                >&laquo;</button>
                {getPageNumbers().map((p, i) => typeof p === 'number' ? (
                    <button
                        key={i}
                        onClick={() => onPageChange(p)}
                        className={`px-3 py-1 border rounded ${p === currentPage ? 'bg-[#51DACF] text-black font-bold' : 'bg-white hover:bg-gray-100'}`}
                    >
                        {p}
                    </button>
                ) : <span key={i} className="px-3 py-1 text-gray-500">...</span>)}
                <button
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                    className="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                >&raquo;</button>
            </div>
        </div>
    );
};