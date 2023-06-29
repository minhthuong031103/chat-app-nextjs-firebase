'use client';

import React, { useEffect } from 'react';
import { IoLogoGoogle, IoLogoFacebook } from 'react-icons/io';
import { useAuth } from '../context/authContext';
import { auth } from '../firebase/config';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { db } from '../firebase/config';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { profileColors } from '../constant/color';
export default function Register() {
  const handleSubmit = async (e) => {
    e.preventDefault(); //not reload page
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    //we have two inputs, so we have two values
    const colorIndex = Math.floor(Math.random() * profileColors.length);

    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await setDoc(doc(db, 'users', user.uid), {
        displayName,
        uid: user.uid,
        email,
        color: profileColors[colorIndex],
      });
      //=> create collection users in firestore
      await setDoc(doc(db, 'userChats', user.uid), {});
      await updateProfile(auth.currentUser, {
        displayName: displayName,
      });
      console.log(user);
      router.push('/');
    } catch (error) {
      console.log(error);
    }
  };
  const router = useRouter();
  const { currentUser, isLoading } = useAuth();
  useEffect(() => {
    if (!isLoading && currentUser) {
      router.push('/');
    }
  }, [currentUser, isLoading]);

  return isLoading || (!isLoading && currentUser) ? (
    'Loading'
  ) : (
    <div className="h-[100vh] flex justify-center items-center bg-c1">
      <div className="flex items-center flex-col w-[600px]">
        <div className="text-center">
          <div className="text-4xl font-bold">Create new account</div>
          <div className="mt-3 text-c3">
            Connect and chat with anyone, anywhere
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-3 w-[500px] mt-5"
        >
          <input
            className="w-full h-14 bg-c5 rounded-xl 
              outline-none border-none px-5 text-c3"
            autoComplete="off"
            type="text"
            placeholder="Name"
          ></input>
          <input
            className="w-full h-14 bg-c5 rounded-xl 
              outline-none border-none px-5 text-c3"
            autoComplete="off"
            type="email"
            placeholder="Email"
          ></input>
          <input
            className="w-full h-14 bg-c5 rounded-xl 
              outline-none border-none px-5 text-c3"
            autoComplete="off"
            type="password"
            placeholder="Password"
          ></input>

          <button
            className="mt-4 w-full h-14 rounded-xl outline-none text-base\
              font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
              "
          >
            Register
          </button>
        </form>

        <div className="flex justify-center gap-1 text-c3 mt-5 ">
          <span>{`Already have an account? `}</span>
          <Link
            href="/login"
            className="font-semibold text-white 
                underline underline-offset-2 cursor-pointer hover:text-slate-400"
          >
            Login Now
          </Link>
        </div>
      </div>
    </div>
  );
}
