import { getCurrentUser } from "@/services/auth.service";
import { redirect } from "next/navigation";
import PermissionDeniedModal from "../../admin/_components/PermissionDeniedModal";

export const metadata = {
  title: 'Create Event',
};

export default async function CreateEventLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    let user;

   try {
      user = await getCurrentUser();
    } catch (err) {
      console.error('Failed to fetch user info:', err);
      redirect('/login'); // if not logged in or failed
    }
    const allowedRoles = [1, 2];
    if (!allowedRoles.includes(user?.role)) {
        return (
          <div className="flex min-h-screen flex-col md:flex-row">
          <div className="flex-1 p-6 bg-gray-100 text-black">
             <PermissionDeniedModal
            title="Access Denied"
            message="You do not have organizer permission."
            redirectUrl="/"
          />
          </div>
        </div>
        );
      }
  return (
    children
  );
}
