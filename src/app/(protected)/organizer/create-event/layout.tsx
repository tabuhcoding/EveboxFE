import { getCurrentUser } from "@/services/auth.service";
import { redirect } from "next/navigation";

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

  return (
    children
  );
}
