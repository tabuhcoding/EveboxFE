export default function LocationTableSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="h-8 w-64 bg-gray-200 rounded mb-2 animate-pulse"></div>
      <div className="h-4 w-96 bg-gray-200 rounded mb-6 animate-pulse"></div>
      <div className="h-0.5 bg-gray-200 mb-6"></div>

      <div className="flex gap-4 mb-6">
        <div className="h-10 w-44 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-10 w-44 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
      </div>

      <div className="flex justify-between mb-6">
        <div className="h-10 w-80 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
      </div>

      <div className="space-y-4">
        <div className="h-12 w-full bg-gray-200 rounded animate-pulse"></div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 w-full bg-gray-100 rounded animate-pulse"></div>
        ))}
      </div>
    </div>
  )
}
