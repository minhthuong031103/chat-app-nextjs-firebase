'use client';
import { useEffect } from 'react';
import { useAuth } from './context/authContext';

import { useRouter } from 'next/navigation';
import Loader from './components/Loader';
import LeftNav from './components/LeftNav';
import Chats from './components/Chats';
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
            <div
              className="w-[400px] p-5 overflow-auto
            scrollbar shrink-0 border-r border-white/[0.05]
            "
            >
              <div className="flex flex-col h-full">
                <Chats />
              </div>
            </div>
            <div>chat</div>
          </div>
        </div>
      </div>
    </>
  );
}
