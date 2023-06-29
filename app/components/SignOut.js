'use client';
import React, { useEffect } from 'react';
import { useAuth } from '../context/authContext';
import { useRouter } from 'next/navigation';
export default function SignOut() {
  const router = useRouter();
  const { signOut, currentUser, isLoading } = useAuth();
  useEffect(() => {
    if (!isLoading && !currentUser) {
      router.push('/login');
    }
  }, [currentUser, isLoading]);
  return <button onClick={signOut}>Sign out</button>;
}
