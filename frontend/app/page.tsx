// uncomment this line to force SSR after fix OAuth redirect URI as explained below. Also remove the 'use client' line
// export const dynamic = 'force-dynamic';
'use client';

import React, { useState } from 'react';
import LoginButton from '../components/LoginButton';
import LoadingSpinner from '../components/LoadingSpinner';
import { useQuery } from 'react-query';

function fetchAccessToken(authCode?: string, codeVerifier?: string) {
  console.log('fetch access token');

  return fetch('/api/auth/accessToken', {
    method: 'POST',
    body: JSON.stringify({
      authCode,
      codeVerifier,
    }),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
}

async function fetchUser(authCode?: string, codeVerifier?: string) {
  console.log('fetch user');
  if (!authCode || !codeVerifier) {
    console.log('no authCode or codeVerifier');
    return Promise.reject();
  }

  console.log('has authCode and codeVerifier. sending request...');
  await fetchAccessToken(authCode, codeVerifier);

  const res = await fetch('/api/auth/user', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  const userInfo = await res.json();

  if (typeof window !== 'undefined') {
    window.localStorage.removeItem('code_verifier');
    window.localStorage.removeItem('code_challenge');
  }

  return userInfo;
}

// uncomment this line and use the line below that to force SSR after fix OAuth redirect URI
// export default async function Home({ searchParams }: any) {
export default function Home() {
  // Ideally we want to redirect to a different page after successful OAuth login, but I have to do some config on OW
  // and the documentation is awful, so currently we're just redirecting to the homepage. This means the homepage has
  // to be a client component instead of a server component, and all this access token request stuff has to be done here,
  // but I guess it works for now, even though it kinda defeats the purpose of using Next.js...

  // uncomment this for SSR. the lines below that is the client component version
  // if (!!searchParams.code) return <LoadingSpinner />;
  const [authCode] = useState(
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('code') || undefined
      : undefined
  );
  const [codeVerifier] = useState(
    typeof window !== 'undefined'
      ? window.localStorage.getItem('code_verifier') || undefined
      : undefined
  );
  // const { data: jwtData, isLoading: isLoadingJwtData } = useQuery(
  //   'jwt',
  //   () => fetchAccessToken(authCode, codeVerifier),
  //   {
  //     retry: false,
  //   }
  // );
  const { data: userInfo, isLoading } = useQuery(
    'userInfo',
    () => fetchUser(authCode, codeVerifier),
    {
      retry: false,
    }
  );
  if (!authCode || !codeVerifier) {
    console.log('no authCode or codeVerifier');
  } else {
    console.log('authCode', authCode);
    console.log('codeVerifier', codeVerifier);
  }

  if (isLoading) return <LoadingSpinner />;

  // console.log('jwtData', jwtData);
  console.log('userInfo', userInfo);

  // if (!!searchParams.get('code')) return <LoadingSpinner />;

  return (
    <div className='w-screen h-screen grid place-content-center'>
      <div className='flex md:flex-row flex-col justify-center md:gap-48 gap-16'>
        <div className='md:w-96 sm:w-4/5 p-4 w-screen flex flex-col justify-center md:gap-16 gap-8 text-left'>
          <h1 className='md:text-6xl text-4xl font-bold text-owSecondary'>
            Bedpres Bot
          </h1>
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
