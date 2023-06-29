'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { IoLogoGoogle, IoLogoFacebook } from 'react-icons/io';
import { auth } from '../firebase/config';
import ToastMessage from '../components/ToastMessage';
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { useAuth } from '../context/authContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
export default function Page() {
  const router = useRouter();
  const [email, setEmail] = useState();
  const { currentUser, isLoading } = useAuth();
  //we can you these value in the context later

  useEffect(() => {
    if (!isLoading && currentUser) {
      //mean user logged
      router.push('/');
    }
  }, [currentUser, isLoading]);
  const handleSubmit = async (e) => {
    e.preventDefault(); //not reload page
    const email = e.target[0].value;
    const password = e.target[1].value;
    //we have two inputs, so we have two values
    console.log(email, password);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.log(error);
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.log(error);
    }
  };
  const signInWithFacebook = async () => {
    try {
      await signInWithPopup(auth, facebookProvider);
    } catch (error) {}
  };
  const resetPassword = async () => {
    try {
      toast.promise(
        async () => {
          //logic

          await sendPasswordResetEmail(auth, email);
        },
        {
          pending: 'Sending reset password email...',
          success: 'Reset password email sent successfully',
          error: 'Error sending reset password email',
        },
        { autoClose: 2000 }
      );
    } catch (error) {
      console.log(error);
    }
  };
  return isLoading || (!isLoading && currentUser) ? (
    'Loading...'
  ) : (
    <div className="h-[100vh] flex justify-center items-center bg-c1">
      <ToastMessage />
      <div className="flex items-center flex-col w-[600px]">
        <div className="text-center">
          <div className="text-4xl font-bold">
            {currentUser} to your account
          </div>
          <div className="mt-3 text-c3">
            Connect and chat with anyone, anywhere
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-3 w-[500px] mt-5"
        >
          <input
            onChange={(e) => {
              setEmail(e.target.value);
            }}
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
          <div className="text-right w-full text-c3">
            <span
              onClick={resetPassword}
              className="cursor-pointer hover:text-slate-300"
            >
              Forgot Password?
            </span>
          </div>
          <button
            type="submit"
            className="mt-4 w-full h-14 rounded-xl outline-none text-base\
    font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
    "
          >
            Login to your account
          </button>
        </form>

        <div className="flex justify-center gap-1 text-c3 mt-5 ">
          <span>{`Don't have an account yet? `}</span>
          <Link
            href="/register"
            className="font-semibold text-white 
      underline underline-offset-2 cursor-pointer hover:text-slate-400"
          >
            Register Now
          </Link>
        </div>
        <div className="flex items-center gap-1 mt-5">
          <span className="w-5 h-[1px] bg-c3"></span>
          <span className="text-c3 font-semibold">OR</span>
          <span className="w-5 h-[1px] bg-c3"></span>
        </div>
        <div className="flex items-center gap-5 w-full mt-10 mb-5">
          <div
            onClick={signInWithGoogle}
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
          w-1/2 h-14 rounded-md cursor-pointer p-[1px]
          "
          >
            <div
              className="flex items-center justify-center gap-3 text-white 
      font-semibold bg-c1 w-full h-full rounded-md
      "
            >
              <IoLogoGoogle size={24} />
              <span>Login with Google</span>
            </div>
          </div>
          <div
            onClick={signInWithFacebook}
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
          w-1/2 h-14 rounded-md cursor-pointer p-[1px]
          "
          >
            <div
              className="flex items-center justify-center gap-3 text-white 
      font-semibold bg-c1 w-full h-full rounded-md
      "
            >
              <IoLogoFacebook size={24} />
              <span>Login with Facebook</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
