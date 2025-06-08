export default function EventLoading() {
    return (
        <div className="mt-5 mb-5 animate-pulse">
            {/* Event Box Skeleton */}
            <div className="bg-gray-200 h-96 w-full rounded-lg mb-8"></div>

            <div className="row align-items-start">
                <div className="col-lg-8 col-md-12 custom-col-left">
                    {/* Description Skeleton */}
                    <div className="bg-white p-4 rounded-lg shadow mb-4">
                        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                        <div className="space-y-3">
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                        </div>
                    </div>

                    {/* Ticket Details Skeleton */}
                    <div className="bg-white p-4 rounded-lg shadow">
                        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                        <div className="space-y-4">
                            <div className="h-20 bg-gray-200 rounded"></div>
                            <div className="h-20 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                </div>

                {/* More Information Skeleton */}
                <div className="col-lg-4 col-md-12">
                    <div className="bg-white p-4 rounded-lg shadow">
                        <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                        <div className="space-y-3">
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Comment Section Skeleton */}
            <div className="bg-white p-4 rounded-lg shadow mt-8">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                        <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                        <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recommended Events Skeleton */}
            <div className="d-flex justify-center mt-8">
                <div className="w-full md:w-5/6">
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-64 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}