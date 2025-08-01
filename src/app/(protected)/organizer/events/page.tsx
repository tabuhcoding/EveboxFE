export const dynamic = "force-dynamic";

/* Package System */
import 'tailwindcss/tailwind.css';

/* Package Application */
import Sidebar from "../create-event/_components/sidebar";
import Tabs from "./_components/tabs";

export default async function Event() {
    // const { session } = useAuth();
    // const eventData = await getEventOfOrg(session.accessToken);

    // const events = eventData;
    
    return (
        <main>
            <div className="flex min-h-screen bg-gray-100">
                <div className="w-64 bg-gray-900 text-white">
                    <Sidebar />
                </div>
                <div className="flex-1 p-6">
                    <Tabs eventss={[]} />
                </div>
            </div>
        </main>
    );
}