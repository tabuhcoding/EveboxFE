/* Package System */
import { Suspense, ReactNode } from "react";
import { Toaster } from "react-hot-toast";

/* Package Application */
import Footer from "app/(frontpage)/_components/common/footer";
import NavigationBar from "app/(frontpage)/_components/common/navigationBar";

import '../../styles/global.css';
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
// import 'tailwindcss/tailwind.css';

export default async function DefaultLayout({
  children,
}: {
  children: ReactNode
}) {
  const token = (await cookies()).get('next-auth.session-token')?.value;

  if (!token) {
    redirect('/login');
  }
  return (
    <Suspense>
      <main>
        <NavigationBar />
        {children}
        <Footer />
        <Toaster reverseOrder={false} />
      </main>
    </Suspense>
  )
}