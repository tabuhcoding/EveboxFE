"use client";

/* Package System */
import { useState } from "react";
import { Search } from "lucide-react";

/* Package Application */
import EventCard from "./eventCard";
import { DisplayEvent } from "../libs/interface/displayEvent";

interface TabsProps {
    events: DisplayEvent[];
}

const tabs = [
    { id: "sap-toi", label: "Sắp tới" },
    { id: "da-qua", label: "Đã qua" },
    { id: "cho-duyet", label: "Chờ duyệt" },
    { id: "nhap", label: "Nháp" }
];

export default function Tabs({ events }: TabsProps) {
    const [activeTab, setActiveTab] = useState("sap-toi");

    const [searchQuery, setSearchQuery] = useState("");

    // Lọc sự kiện theo địa điểm
    const filteredEvents = events.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div>
            {/* Thanh tìm kiếm và các tab */}
            <div className="mt-6 flex justify-between items-center">
                <div className="flex items-center border border-gray-300 rounded-md overflow-hidden w-1/3 bg-white">
                    <input
                        type="text"
                        className="w-full px-3 py-2 outline-none"
                        placeholder="Tìm kiếm sự kiện"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button className="bg-[#51DACF] px-3 py-2 border-l border-gray-300 transition duration-200 hover:bg-[#3AB5A3]">
                        <Search size={24} color="white" />
                    </button>
                </div>
                <div className="flex space-x-4">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`px-6 py-2 rounded-full ${activeTab === tab.id ? 'bg-[#0C4762] text-[#9EF5CF]' : 'bg-[#9EF5CF] text-gray-700'}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Danh sách sự kiện */}
            <div className="mt-6 space-y-6">
                {activeTab === "cho-duyet" ? (
                    filteredEvents.map(event => (
                            <EventCard key={event.id} event={event} />
                        ))
                ) : (
                    <p className="text-center text-gray-500">Không có sự kiện nào.</p>
                )}
            </div>
        </div>
    );
}