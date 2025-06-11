// booking/components/navigation.tsx
'use client';

/* Package System */
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'tailwindcss/tailwind.css';

/* Package Application */

export default function Navigation({ title }: { title: string }) {
    const router = useRouter();

    return (
        <div className="booking-navigation flex items-center justify-center p-10 relative">
            <button onClick={() => router.back()} className="p-1.5 border-2 border-[#0C4762] rounded-md hover:bg-gray-200 absolute left-16">
                <ArrowLeft size={20} className="text-[#0C4762]" />
            </button>
            <h1 className="text-3xl font-semibold">{title}</h1>
        </div>
    );
}