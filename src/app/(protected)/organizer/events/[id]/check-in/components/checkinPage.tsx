'use client';

/* Package System */
import 'tailwindcss/tailwind.css';
import { useState } from 'react';

/* Package Application */
import CheckinStats from './checkinStats';
import SearchBar from './common/searchBar';
import TicketCheckinTable from './ticketCheckinTable';
import Tabs from './common/tab';
import SelectShowtimeModal from './selectShowtimeModal';
import { FaSync } from 'react-icons/fa';
import SidebarOrganizer from '../../_components/sidebarOrganizer';

export default function CheckinPage() {
    const [activeTab, setActiveTab] = useState("all");
    const [searchKeyword, setSearchKeyword] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedShow, setSelectedShow] = useState({ date: "2025-05-20", time: "19:00 - 21:00" });

    const handleShowtimeConfirm = (date: string, time: string) => {
        setSelectedShow({ date, time });
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <div className="w-64 bg-gray-900 text-white">
                <SidebarOrganizer />
            </div>
            <div className="flex-1 p-6">
                <h1 className="text-2xl font-bold text-[#0C4762]">LiveShow ca nhạc</h1>
                <p className="text-sm text-[#51DACF] pt-2">{selectedShow.time}, {new Date(selectedShow.date).toLocaleDateString('vi-VN')}</p>
                <div className="border-t-2 border-[#0C4762] mt-2"></div>

                {/* Check-in */}
                <div className="flex justify-between items-center mt-6 mb-2">
                    <h3 className="text-xl font-bold text-[#0C4762]">Check-in</h3>
                    <button
                        className="flex items-center gap-1 border border-[#0C4762] px-4 py-1 rounded-full text-[#0C4762] hover:bg-[#e6f7fa]"
                        onClick={() => setShowModal(true)}
                    >
                        Đổi suất diễn <FaSync />
                    </button>
                </div>

                <h3 className="text-lg font-bold text-[#0C4762] mb-2 mt-6">Tổng quan</h3>
                <CheckinStats />

                {/* Chi tiết vé */}
                <h3 className="text-lg font-bold text-[#0C4762] mb-2 mt-6">Chi tiết</h3>

                <div className="flex justify-between items-center mt-2 mb-2">
                    <SearchBar onSearch={setSearchKeyword} />
                    <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>

                <TicketCheckinTable activeTab={activeTab} searchKeyword={searchKeyword} />

                <SelectShowtimeModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    onConfirm={handleShowtimeConfirm}
                    selectedShow={selectedShow} 
                />
            </div>
        </div>
    );
}
