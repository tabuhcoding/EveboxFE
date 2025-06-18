import 'tailwindcss/tailwind.css';

export default function Loading() {

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-teal-400"></div>
            <span className="ml-3 text-teal-400 text-xl font-semibold">Đang tải...</span>
        </div>
    );
};