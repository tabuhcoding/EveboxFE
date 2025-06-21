export default function SearchLoading() {
    return (
        <div className="min-h-screen flex flex-col animate-pulse">
            <main className="flex-1">
                <div className="flex justify-center mt-8 px-4">
                    <div className="w-full md:w-5/6">
                        {/* Header and Filters Skeleton */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                            {/* Search Results Title */}
                            <div className="h-8 bg-gray-300 rounded w-48"></div>

                            {/* Filters Container */}
                            <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                                {/* Weekday Filter */}
                                <div className="w-full md:w-40 h-10 bg-gray-300 rounded"></div>
                                
                                {/* Event Type Filter */}
                                <div className="w-full md:w-40 h-10 bg-gray-300 rounded"></div>
                                
                                {/* Price Range Filter */}
                                <div className="w-full md:w-80 h-10 bg-gray-300 rounded"></div>
                            </div>
                        </div>

                        {/* Event Cards Grid Skeleton */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
                            {[...Array(12)].map((_, index) => (
                                <div key={index} className="bg-gray-200 rounded-lg overflow-hidden">
                                    {/* Image Placeholder */}
                                    <div className="aspect-[13/9] bg-gray-300"></div>
                                    
                                    {/* Content Placeholder */}
                                    <div className="p-3">
                                        {/* Title */}
                                        <div className="h-12 bg-gray-300 rounded mb-3"></div>
                                        
                                        {/* Date and Price */}
                                        <div className="flex flex-col md:flex-row md:justify-between gap-2">
                                            <div className="h-12 bg-gray-300 rounded w-24"></div>
                                            <div className="h-6 bg-gray-300 rounded w-20"></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Load More Button Skeleton */}
                        <div className="flex justify-center mt-8 mb-8">
                            <div className="w-32 h-10 bg-gray-300 rounded"></div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}