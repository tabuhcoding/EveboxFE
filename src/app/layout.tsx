/* Package System */
import { ReactNode } from 'react';

/* Package Application */
import { Providers } from "./provider";
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
    <html>
      <body>
        <>
          <Providers>
            <div className="tt-content relative">
              <div>
                {children}
              </div>
            </div>
          </Providers>
        </>
      </body>
    </html>
  );
}
