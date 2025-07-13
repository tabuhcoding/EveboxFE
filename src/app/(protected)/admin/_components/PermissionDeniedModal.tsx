'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PermissionDeniedModal({
  title,
  message,
  redirectUrl,
}: {
  title: string;
  message: string;
  redirectUrl: string;
}) {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push(redirectUrl);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [router, redirectUrl]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
        <h2 className="text-xl font-semibold text-red-600 mb-2">{title}</h2>
        <p>{message}</p>
        <p className="text-sm text-gray-500 mt-2">Redirecting to home...</p>
      </div>
    </div>
  );
}
