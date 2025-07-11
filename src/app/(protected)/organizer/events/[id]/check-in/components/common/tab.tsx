"use client";

/* Package Application */
import { TabsProps } from "../../lib/interface/check-in.interface";

const tabs = [
    { id: "all", label: "Tất cả" },
    { id: "e-ticket", label: "Vé điện tử" },
    { id: "ticket", label: "Vé cứng" },
];

export default function Tabs({ activeTab, setActiveTab }: TabsProps ) {
    return (
        <div className="tabs-event-management flex justify-end space-x-4 text-sm">
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
    );
}