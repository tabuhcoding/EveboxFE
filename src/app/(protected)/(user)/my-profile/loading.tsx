import 'tailwindcss/tailwind.css';

export default function Loading() {
    return (
      <div className="max-w-3xl mx-auto animate-pulse">
        <div className="flex justify-between items-center">
          <div>
            <div className="h-6 bg-gray-300 rounded w-64 mt-8 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-80"></div>
          </div>
          <div className="w-20 h-20 bg-gray-300 rounded-full"></div>
        </div>
  
        <hr className="my-6 border-gray-300" />
  
        <div className="space-y-6">
          <div>
            <div className="h-4 bg-gray-300 rounded w-32 mb-1"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
  
          <div>
            <div className="h-4 bg-gray-300 rounded w-32 mb-1"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
  
          <div>
            <div className="h-4 bg-gray-300 rounded w-32 mb-1"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
  
          <div>
            <div className="h-10 bg-[#A3E5E0] rounded-md"></div>
          </div>
        </div>
      </div>
    );
  }
  