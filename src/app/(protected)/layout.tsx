/* Package System */
import { Suspense, ReactNode } from "react";
import { Toaster } from "react-hot-toast";

/* Package Application */
import '../../styles/global.css';
import NavigationBar from "components/common/navigationBar";
import Footer from "components/common/footer";
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