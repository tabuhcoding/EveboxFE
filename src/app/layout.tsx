/* Package System */
import { ReactNode } from 'react';

/* Package Application */
import { Providers } from "./provider";
import "tailwindcss/tailwind.css";


export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
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
