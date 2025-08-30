'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';

/**
 * A utility hook to protect client-side routes
 * Redirects to sign-in page if user is not authenticated
 * @param redirectTo - The path to redirect to if not authenticated
 */
export function useProtectedRoute(redirectTo: string = '/auth/sign-in') {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(redirectTo);
    }
  }, [user, isLoading, router, redirectTo]);

  return { user, isLoading };
}