import React from 'react';
import { IoLogoGoogle, IoLogoFacebook } from 'react-icons/io';
import Link from 'next/link';
export default function Register() {
  return (
    <div className="h-[100vh] flex justify-center items-center bg-c1">
      <div className="flex items-center flex-col w-[600px]">
        <div className="text-center">
          <div className="text-4xl font-bold">Create new account</div>
          <div className="mt-3 text-c3">
            Connect and chat with anyone, anywhere
          </div>
        </div>

        <form className="flex flex-col items-center gap-3 w-[500px] mt-5">
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
