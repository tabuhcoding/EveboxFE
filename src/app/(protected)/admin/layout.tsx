/* Package System */
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

/* Package Application */
import AdminSidebar from "./_components/adminSidebar";

export default function DefaultLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Sidebar */}
      <div className="block md:block w-64 bg-gray-900 text-white z-20 absolute md:relative h-full md:h-auto">
        <AdminSidebar />
      </div>

      {/* Page content */}
      <div className="flex-1 p-6 bg-gray-100 text-black">
        {children}
        <Toaster reverseOrder={false} />
      </div>
    </div>
  )
}