export default function EventTableSkeleton() {
  return (
    <div className="table-event-management overflow-x-auto rounded-xl shadow-md mt-6 animate-pulse">
      <table className="min-w-full border border-gray-200">
        <thead>
          <tr className="bg-[#0C4762] text-center text-white text-xs rounded-t-lg">
            <th className="px-4 py-3 min-w-[64px]">ID</th>
            <th className="px-4 py-3 min-w-[85px]">Hình ảnh</th>
            <th className="px-4 py-3 min-w-[160px]">Tên sự kiện</th>
            <th className="px-4 py-3 min-w-[100px]">Thể loại</th>
            <th className="px-4 py-3 min-w-[140px]">Địa điểm</th>
            <th className="px-4 py-3 min-w-[118px]">Người tạo</th>
            <th className="px-4 py-3 min-w-[102px]">Ngày tạo</th>
            <th className="px-4 py-3">Trạng thái</th>
            <th className="px-4 py-3 min-w-[82px]">Thao tác</th>
          </tr>
        </thead>
        <tbody className="text-xs">
          {Array.from({ length: 5 }).map((_, index) => (
            <tr key={index} className="border-t border-gray-200">
              {Array.from({ length: 9 }).map((_, colIndex) => (
                <td key={colIndex} className="px-4 py-3 border-r border-gray-200">
                  <div className="h-4 bg-gray-300 rounded w-full" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}