'use client';

import React, { useContext } from 'react';
import Image from 'next/image';
import { AuthContext } from '../providers/AuthContext';

export default function LoginButton() {
  const authContext = useContext(AuthContext);
  console.log(authContext);
  // console.log(`authContext.isLoggedIn: ${authContext.isLoggedIn}`);
  return (
    <button
      onClick={authContext.logIn}
      className='bg-owPrimary text-white font-bold py-2 px-4 rounded flex flex-row items-center justify-center gap-4'
    >
      <Image src='/ow-icon.png' alt='Logo' width={48} height={48} />
      <p className='md:text-3xl text-xl'>Logg Inn</p>
    </button>
  );
}
