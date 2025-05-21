/* Package System */
import { ReactNode } from 'react';

/* Package Application */
import Footer from "../components/common/footer";
import NavigationBar from "../components/common/navigationBar";

import { Providers } from "./provider";
// import "../styles/global.css";
import "tailwindcss/tailwind.css";


export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <>
          <Providers>
            <div className="tt-content relative">
              <div>
                <NavigationBar />
                {children}
                <Footer />
              </div>
            </div>
          </Providers>
        </>
      </body>
    </html>
  );
}
