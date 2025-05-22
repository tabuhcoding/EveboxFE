/* eslint-disable no-duplicate-imports */
'use client';

/* Package System */
import type { JSX } from 'react';
import { useEffect } from 'react';
import { scan } from 'react-scan'

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