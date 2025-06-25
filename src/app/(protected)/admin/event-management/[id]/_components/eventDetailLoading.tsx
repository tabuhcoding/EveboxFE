export default function EventDetailLoading() {
  return (
    <div className="animate-pulse max-w-4xl mx-auto px-8 py-6">
      {/* Title Skeleton */}
      <div className="h-6 bg-gray-300 rounded w-3/4 mx-auto mb-6" />

      {/* Poster Skeleton */}
      <div className="w-full h-60 bg-gray-200 rounded-lg mb-6" />

      {/* Info Skeleton */}
      <div className="space-y-4 mb-6">
        {[...Array(7)].map((_, idx) => (
          <div key={idx} className="h-4 bg-gray-200 rounded w-2/3" />
        ))}
      </div>

      {/* Trạng thái Skeleton */}
      <div className="h-6 w-32 bg-gray-300 rounded-full" />

      {/* Subheading for Showing Table */}
      <div className="h-5 bg-gray-300 rounded w-48 mt-10 mb-4" />

      {/* Table Skeleton */}
      <div className="overflow-hidden border border-gray-200 rounded-lg">
        <div className="grid grid-cols-7 gap-2 p-4 bg-gray-50 text-xs font-semibold text-gray-500">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded w-full" />
          ))}
        </div>
        {Array.from({ length: 3 }).map((_, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-7 gap-2 p-4 border-t border-gray-100">
            {Array.from({ length: 7 }).map((_, colIndex) => (
              <div key={colIndex} className="h-3 bg-gray-100 rounded w-full" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}