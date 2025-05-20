'use client';

/* Package System */
import { scan } from 'react-scan'
import type { JSX } from 'react';
import { useEffect } from 'react';

export function ReactScan(): JSX.Element {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      scan({
        enabled: true
      });
    }
  }, []);

  return <></>
}