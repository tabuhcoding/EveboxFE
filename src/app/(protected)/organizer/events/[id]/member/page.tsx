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
                    <h1 className="text-2xl font-bold text-[#0C4762]">Members</h1>
                    <div className="border-t-2 border-[#0C4762] mt-4"></div>
                    <MemberTable/>
                </div>
            </div>
        </main>
    );
}
