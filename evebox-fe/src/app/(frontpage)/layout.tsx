/* Package System */
import { Suspense, ReactNode } from "react";
import { Toaster } from "react-hot-toast";

/* Package Application */
import DashboardLoading from "./loading";
import '../../styles/global.css';
// import 'tailwindcss/tailwind.css';

export default function DefaultLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <main>
        {children}
        <Toaster reverseOrder={false} />
      </main>
    </Suspense>
  )
}