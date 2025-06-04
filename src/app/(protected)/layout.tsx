/* Package System */
import { Suspense, ReactNode } from "react";
import { Toaster } from "react-hot-toast";

/* Package Application */
import Footer from "app/(frontpage)/_components/common/footer";
import NavigationBar from "app/(frontpage)/_components/common/navigationBar";

import '../../styles/global.css';
// import 'tailwindcss/tailwind.css';

export default function DefaultLayout({
  children,
}: {
  children: ReactNode
}) {
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