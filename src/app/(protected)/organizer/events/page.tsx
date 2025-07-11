export const dynamic = "force-dynamic";

/* Package System */
import 'tailwindcss/tailwind.css';

/* Package Application */
import Sidebar from "../create-event/_components/sidebar";
import Tabs from "./_components/tabs";
import { getEventOfOrg } from '@/services/org.service';

export default async function Event() {
    const eventData = await getEventOfOrg();

    const events = eventData;
    
    return (
        <main>
            <div className="flex min-h-screen bg-gray-100">
                <div className="w-64 bg-gray-900 text-white">
                    <Sidebar />
                </div>
                <div className="flex-1 p-6">
                    <h1 className="text-2xl font-bold text-[#0C4762]">My Events</h1>
                    <div className="border-t-2 border-[#0C4762] mt-2"></div>
                    <Tabs events={events}/>
                </div>
            </div>
        </main>
    );
}