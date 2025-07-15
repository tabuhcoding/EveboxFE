/* Package System */
import { ReactNode } from 'react';
import { Montserrat } from 'next/font/google';

/* Package Application */
import { Providers } from "./provider";
import ChatboxButton from './(frontpage)/(chatbox)/chatboxBtn';
import "tailwindcss/tailwind.css";

export const metadata = {
  title: 'Evebox - Bán vé và quản lý sự kiện',
  description: 'evebox.vn',
  icons: {
    icon: '/images/logoweb.png', 
  },
};

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-montserrat',
  display: 'swap'
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body className="font-sans">
        <>
          <Providers>
            <div className="tt-content relative">
              <div>
                {children}
              </div>
              <ChatboxButton />
            </div>
          </Providers>
        </>
      </body>
    </html>
  );
}
