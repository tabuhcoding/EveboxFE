'use client';

interface CardButtonProps {
  label: string;
  onClick: () => void;
}

export default function CardButton({ label, onClick }: CardButtonProps) {
  return (
    <div className="border border-gray-200 rounded-md shadow-sm bg-[#51DACF]">
      <button
        onClick={onClick}
        className="flex items-center w-full px-4 py-2 text-left text-sm font-medium text-white hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
      >
        ➤ {label}
      </button>
    </div>
  );
}
