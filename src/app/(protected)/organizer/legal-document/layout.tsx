'use client';

import 'tailwindcss/tailwind.css';
import Sidebar from '../create-event/_components/sidebar';

export default function LegalDocumentLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-gray-100">
            <div className="w-64 bg-gray-900 text-white">
                <Sidebar />
            </div>

            <div className="flex-1 p-6">
                {children}
            </div>
        </div>
    );
}
