// components/LoadingSkeleton.tsx
export default function SpecialEventTableLoading() {
    return (
        <div className="table-event-special-management overflow-x-auto rounded-xl shadow-md mt-6">
            <table className="min-w-full border border-gray-200">
                <thead>
                    <tr className="bg-[#0C4762] text-center text-white text-xs rounded-t-lg">
                        <th className="px-4 py-3 min-w-[65px]">
                            <div className="h-4 bg-gray-300 rounded w-12"></div> {/* Skeleton for ID */}
                        </th>
                        <th className="px-4 py-3 min-w-[84px]">
                            <div className="h-12 bg-gray-300 rounded w-14 mx-auto"></div> {/* Skeleton for Image */}
                        </th>
                        <th className="px-4 py-3 min-w-[155px]">
                            <div className="h-4 bg-gray-300 rounded w-36"></div> {/* Skeleton for Title */}
                        </th>
                        <th className="px-4 py-3 min-w-[130px]">
                            <div className="h-4 bg-gray-300 rounded w-28"></div> {/* Skeleton for Special Event */}
                        </th>
                        <th className="px-4 py-3 min-w-[140px]">
                            <div className="h-4 bg-gray-300 rounded w-28"></div> {/* Skeleton for Only on Eve */}
                        </th>
                        <th className="px-4 py-3 min-w-[100px]">
                            <div className="h-4 bg-gray-300 rounded w-24"></div> {/* Skeleton for Music */}
                        </th>
                        <th className="px-4 py-3 min-w-[90px]">
                            <div className="h-4 bg-gray-300 rounded w-24"></div> {/* Skeleton for Theater */}
                        </th>
                        <th className="px-4 py-3 min-w-[100px]">
                            <div className="h-4 bg-gray-300 rounded w-24"></div> {/* Skeleton for Sports */}
                        </th>
                        <th className="px-4 py-3 min-w-[82px]">
                            <div className="h-4 bg-gray-300 rounded w-20"></div> {/* Skeleton for Other */}
                        </th>
                    </tr>
                </thead>
                <tbody className="text-xs">
                    {/* Placeholder rows */}
                    {Array.from({ length: 6 }).map((_, index) => (
                        <tr key={index} className="border-t border-gray-200">
                            <td className="px-4 py-3 text-center border-r border-gray-200">
                                <div className="h-4 bg-gray-200 rounded w-12"></div> {/* Skeleton for ID */}
                            </td>
                            <td className="px-4 py-3 border-r border-gray-200 text-center">
                                <div className="h-12 bg-gray-200 rounded w-14 mx-auto"></div> {/* Skeleton for Image */}
                            </td>
                            <td className="px-4 py-3 border-r border-gray-200">
                                <div className="h-4 bg-gray-200 rounded w-36"></div> {/* Skeleton for Title */}
                            </td>
                            <td className="px-4 py-3 border-r border-gray-200">
                                <div className="h-4 bg-gray-200 rounded w-28"></div> {/* Skeleton for Special Event */}
                            </td>
                            <td className="px-4 py-3 border-r border-gray-200">
                                <div className="h-4 bg-gray-200 rounded w-28"></div> {/* Skeleton for Only on Eve */}
                            </td>
                            <td className="px-4 py-3 border-r border-gray-200">
                                <div className="h-4 bg-gray-200 rounded w-24"></div> {/* Skeleton for Music */}
                            </td>
                            <td className="px-4 py-3 border-r border-gray-200">
                                <div className="h-4 bg-gray-200 rounded w-24"></div> {/* Skeleton for Theater */}
                            </td>
                            <td className="px-4 py-3 border-r border-gray-200">
                                <div className="h-4 bg-gray-200 rounded w-24"></div> {/* Skeleton for Sports */}
                            </td>
                            <td className="px-4 py-3 border-r border-gray-200">
                                <div className="h-4 bg-gray-200 rounded w-20"></div> {/* Skeleton for Other */}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
