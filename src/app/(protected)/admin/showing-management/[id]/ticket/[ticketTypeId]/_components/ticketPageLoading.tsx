export default function TicketPageLoading() {
    return (
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6 mt-8 mb-6">
            {/* Skeleton for Event Info */}
            <div className="px-6">
                <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div> {/* Event Title */}
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div> {/* Date */}
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div> {/* Time */}
            </div>

            {/* Skeleton for Ticket Info */}
            <div className="detail-event max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6 mt-3 mb-6">
                <div className="flex justify-center">
                    <div className="bg-gray-300 rounded-md w-3/4 h-36"></div> {/* Image Placeholder */}
                </div>
                <div className="p-6">
                    <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div> {/* Ticket Name */}
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div> {/* Description */}
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div> {/* Price */}
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div> {/* Start Time */}
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div> {/* End Time */}
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div> {/* Min/Max Quantity */}
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div> {/* Total Quantity */}
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div> {/* Sold Quantity */}
                </div>
            </div>
        </div>
    );
}
