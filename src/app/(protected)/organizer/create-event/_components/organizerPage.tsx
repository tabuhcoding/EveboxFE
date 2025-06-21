/* Package System */
import 'tailwindcss/tailwind.css';

/* Package Application */
import Sidebar from './sidebar';
import InformationEventClientPage from '../../create-event/[id]/components/info-event/page';

export default function OrganizerPage() {
    return (
        <div className="flex min-h-screen">
            <div className="w-64 bg-gray-900 mr-6">
                <Sidebar />
            </div>

            <div className="w-full flex flex-col">
                <InformationEventClientPage />
            </div>

        </div>
    )
}

export const dynamic = 'force-dynamic';