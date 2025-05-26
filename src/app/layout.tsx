/* Package System */
import { ReactNode } from 'react';

/* Package Application */
import Footer from "../components/common/footer";
import NavigationBar from "../components/common/navigationBar";

import { Providers } from "./provider";
// import "../styles/global.css";
import "tailwindcss/tailwind.css";

export const metadata = {
  title: 'Evebox - Bán vé và quản lý sự kiện',
  description: 'evebox.vn',
  icons: {
    icon: '/images/logoweb.png', 
  },
};

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
