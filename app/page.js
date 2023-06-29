'use client';
import { useEffect } from 'react';
import { useAuth } from './context/authContext';
import SignOut from './components/signOut';
import { useRouter } from 'next/navigation';
export default function Page() {
  const router = useRouter();
  const { signOut, currentUser, isLoading } = useAuth();
  useEffect(() => {
    if (!isLoading && !currentUser) {
      router.push('/login');
    }
  }, [currentUser, isLoading]);
  return <button onClick={signOut}>Sign out</button>;
}
