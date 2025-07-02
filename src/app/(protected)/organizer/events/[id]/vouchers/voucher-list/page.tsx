
import 'tailwindcss/tailwind.css';

import SidebarOrganizer from '../../components/sidebarOrganizer';
import VoucherTable from './components/voucherTable';

export default function Member() {
    return (
        <main>
            <div className="flex min-h-screen bg-gray-100">
                <div className="w-64 bg-gray-900 text-white">
                    <SidebarOrganizer />
                </div>
                <div className="flex-1 p-6">
                    <h1 className="text-2xl font-bold text-[#0C4762]">LiveShow ca nhạc</h1>
                    <p className="text-sm text-[#51DACF] pt-2">20:00 - 23:00, 25 tháng 10, 2024</p>
                    <div className="border-t-2 border-[#0C4762] mt-2"></div>
                    <div className="py-6 flex items-center space-x-6">
                        <h3 className="text-lg font-bold text-[#0C4762] mb-2">Danh sách voucher</h3>
                    </div>
                    <VoucherTable />
                </div>
            </div>
        </main>
    );
}
