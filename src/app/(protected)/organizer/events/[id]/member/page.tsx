import 'tailwindcss/tailwind.css';

import MemberTable from "./components/memberTable";
import SidebarOrganizer from '../_components/sidebarOrganizer';


export default function Member() {
    
    return (
        <main>
            <div className="flex min-h-screen bg-gray-100">
                <div className="w-64 bg-gray-900 text-white">
                    <SidebarOrganizer />
                </div>
                <div className="flex-1 p-6">
                    <h1 className="text-2xl font-bold text-[#0C4762]">LiveShow ca nhạc</h1>
                    <div className="border-t-2 border-[#0C4762] mt-2"></div>
                    <div className="py-6 flex items-center space-x-6">
                        <h3 className="text-lg font-bold text-[#0C4762] mb-2">Danh sách thành viên</h3>
                    </div>
                    <MemberTable/>
                </div>
            </div>
        </main>
    );
}
