'use client';

/* Package System */
import { useState } from 'react';
import 'tailwindcss/tailwind.css';

/* Package Application */
import EventStep from './components/common/eventStep';
import Sidebar from '../_components/sidebar';

export default function Page() {
    const [eventId] = useState<number | 1>(1); // Gán cứng là 1 tuy nhiên sau này sẽ dựa và db tạo event để tạo ID
    return (
        <div className="flex min-h-screen">
            <div className="w-64 bg-gray-900 mr-6">
                <Sidebar />
            </div>

            <div className="w-full flex flex-col">
                {/* Gán cứng là 1 tuy nhiên sau này sẽ dựa và db tạo event để tạo ID */}
                <EventStep eventId={eventId || 1}/>  
            </div>

        </div>
    )
}