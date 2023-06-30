import Image from 'next/image';
import React from 'react';
import loaderImage from '../../public/loader.svg';
export default function Loader() {
  return (
    <div
      className="fixed top-0 left-0 w-full h-full flex
    justify-center items-center
    "
    >
      <Image
        priority
        src={loaderImage}
        alt="loader"
        width={100}
        height={100}
      ></Image>
    </div>
  );
}
