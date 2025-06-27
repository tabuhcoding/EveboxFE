import 'tailwindcss/tailwind.css';

export default function DashboardLoading() {
    return (
        <div className="animate-pulse">
            {/* Main Content */}
            <div className="min-h-screen flex flex-col mt-16">
                {/* Image Slider Skeleton */}
                <div className="w-full flex justify-center flex-col items-center px-4 md:mt-8">
                    <div className="w-full md:w-5/6 relative">
                        <div className="h-[500px] bg-gray-300 rounded-lg"></div>
                        
                        {/* Search Controls Skeleton */}
                        <div className="absolute left-0 right-0 -bottom-20 mx-auto w-full md:w-11/12 px-4">
                            <div className="bg-sky-900 p-6 rounded-lg shadow-lg">
                                <div className="flex flex-col md:flex-row gap-4">
                                    {[1,2,3,4,5].map(i => (
                                        <div key={i} className="flex-1 h-20 bg-gray-300 rounded"></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Event Sliders Skeleton */}
                <div className="flex justify-center mt-36 px-4">
                    <div className="w-full md:w-5/6">
                        {[1,2,3,4].map(section => (
                            <div key={section} className="mt-8">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="w-48 h-8 bg-gray-300 rounded"></div>
                                    <div className="w-24 h-6 bg-gray-300 rounded"></div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    {[1,2,3,4].map(card => (
                                        <div key={card} className="bg-gray-300 rounded-lg h-64"></div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

