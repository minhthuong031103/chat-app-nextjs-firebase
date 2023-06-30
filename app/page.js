'use client';
import { useEffect } from 'react';
import { useAuth } from './context/authContext';

import { useRouter } from 'next/navigation';
import Loader from './components/Loader';
import LeftNav from './components/LeftNav';
export default function Page() {
  const router = useRouter();
  const { signOut, currentUser, isLoading } = useAuth();
  useEffect(() => {
    if (!isLoading && !currentUser) {
      router.push('/login');
    }
  }, [currentUser, isLoading]);
  return isLoading || !currentUser ? (
    <Loader />
  ) : (
    <>
      <div className="bg-c1 flex h-[100vh]">
        <div className="flex w-full shrink-0">
          <LeftNav />

          <div className="flex bg-c2 grow">
            <div>side bar</div>
            <div>chat</div>
          </div>
        </div>
      </div>
    </>
  );
}
