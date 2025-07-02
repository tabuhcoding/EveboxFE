/* Package System */
import 'tailwindcss/tailwind.css';
import { getServerSession } from 'next-auth/next';

/* Package Application */
import Sidebar from "../create-event/_components/sidebar";
import Tabs from "./_components/tabs";
import { authOptions } from '@/lib/authOptions';
import { fetchAllOrgEvent } from './libs/server/fetchAllOrgEvent';
import { DisplayEvent } from './libs/interface/displayEvent';

export default async function Event() {
    const session = await getServerSession(authOptions);
    const accessToken = session?.user?.accessToken || null;
    const data = await fetchAllOrgEvent(accessToken);
    const eventData = data.data || [];
    const events = eventData.map((event: DisplayEvent) => ({
        id: event.id,
        title: event.title,
        startTime: event.startTime,
        location: event.venue,
        address: event.locationsString,
        image: event.Images_Events_imgPosterIdToImages?.imageUrl || "/images/default-image.png",
        isApproved: event.isApproved,
    }));
    
    return (
        <main>
            <div className="flex min-h-screen bg-gray-100">
                <div className="w-64 bg-gray-900 text-white">
                    <Sidebar />
                </div>
                <div className="flex-1 p-6">
                    <h1 className="text-2xl font-bold text-[#0C4762]">Sự kiện của tôi</h1>
                    <div className="border-t-2 border-[#0C4762] mt-2"></div>
                    <Tabs events={events}/>
                </div>
            </div>
        </main>
    );
}