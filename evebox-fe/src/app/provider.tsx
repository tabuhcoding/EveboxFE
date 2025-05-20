'use client';

/* Package System */
import { ReactNode } from 'react';
import { NextUIProvider } from '@nextui-org/react';
import { SessionProvider } from 'next-auth/react';

/* Package Application */
import I18nProvider from './providers/i18nProvider';
import { AuthProvider } from 'contexts/auth.context';
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