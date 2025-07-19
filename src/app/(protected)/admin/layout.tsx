/* Package System */
import { ReactNode, use } from "react";
import { Toaster } from "react-hot-toast";

/* Package Application */
import AdminSidebar from "./_components/adminSidebar";
import { getCurrentUser } from "@/services/auth.service";
import { redirect } from "next/navigation";
import PermissionDeniedModal from "./_components/PermissionDeniedModal";

export default async function DefaultLayout({ children }: { children: ReactNode }) {
  let user;

  try {
    user = await getCurrentUser();
    console.log('-----', user);
  } catch (err) {
    console.error('Failed to fetch user info:', err);
    redirect('/login'); // if not logged in or failed
  }

  if (user.role !== 1) {
    return (
      <div className="flex min-h-screen flex-col md:flex-row">
      <div className="flex-1 p-6 bg-gray-100 text-black">
         <PermissionDeniedModal
        title="Access Denied"
        message="You do not have admin permission."
        redirectUrl="/"
      />
      </div>
    </div>
     
    );
  }
  
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