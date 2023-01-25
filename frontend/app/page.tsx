import React from 'react';
import LoginButton from '../components/LoginButton';

export default function Home() {
  return (
    <div className='w-screen h-screen grid place-content-center'>
      <div className='flex md:flex-row flex-col justify-center md:gap-48 gap-16'>
        <div className='md:w-96 sm:w-4/5 p-4 w-screen flex flex-col justify-center md:gap-16 gap-8 text-left'>
          <h1 className='md:text-6xl text-4xl font-bold text-owSecondary'>
            Bedpres Bot
          </h1>
          <h2 className='italic'>Bedpres Bot er under utvikling...</h2>
          <p className='md:text-xl text-base md:text-left text-justify font-bold'>
            Få <span className='text-owSecondary'>varsling </span>om
            bedriftspresentasjoner og andre{' '}
            <span className='text-owSecondary'>arrangementer</span>. Unngå å få
            prikk fordi du glemte å melde deg av et arrangement. Registrer deg{' '}
            <span className='text-owSecondary'>gratis</span> med din
            Online-bruker.
          </p>
        </div>
        <div className='p-4 flex flex-col justify-center gap-8'>
          <LoginButton />
        </div>
      </div>
    </div>
  );
}
