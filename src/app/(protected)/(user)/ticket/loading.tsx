import 'tailwindcss/tailwind.css';
import { useTranslations } from 'next-intl';

export default function Loading() {
    const t = useTranslations('common');

    const transWithFallback = (key: string, fallback: string) => {
        const msg = t(key);
        if (!msg || msg.startsWith('common.')) return fallback;
        return msg;
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-teal-400"></div>
            <span className="ml-3 text-teal-400 text-xl font-semibold">{transWithFallback('uploading', 'Đang tải...')}</span>
        </div>
    );
};