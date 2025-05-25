/* Package System */
import { Suspense, ReactNode } from "react";
import { Toaster } from "react-hot-toast";

/* Package Application */
import NavigationBar from "components/common/navigationBar";
import Footer from "components/common/footer";

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
        <NavigationBar />
        {children}
        <Footer />
        <Toaster reverseOrder={false} />
      </main>
    </Suspense>
  )
}