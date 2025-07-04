import SidebarOrganizer from "../_components/sidebarOrganizer";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-64 bg-gray-900 text-white">
        <SidebarOrganizer />
      </div>
      <div className="flex flex-col items-center justify-center text-center flex-1">
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          Bạn không có quyền truy cập trang này
        </h1>
        <p className="text-gray-700">
          Vui lòng liên hệ quản trị viên nếu bạn tin rằng đây là một sự nhầm lẫn.
        </p>
      </div>
    </div>
  );
}
