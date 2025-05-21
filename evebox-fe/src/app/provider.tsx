'use client';

/* Package System */
import { NextUIProvider } from '@nextui-org/react';
import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

/* Package Application */
import { AuthProvider } from 'contexts/auth.context';

import I18nProvider from './providers/i18nProvider';
import { SearchResultProvider } from './providers/searchResultProvider';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <SessionProvider>
        <NextUIProvider>
          <SearchResultProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </SearchResultProvider>
        </NextUIProvider>
      </SessionProvider>
    </I18nProvider>
  )
}