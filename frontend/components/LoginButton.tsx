'use client';

import React, { useContext } from 'react';
import Image from 'next/image';
import pkceChallenge from 'pkce-challenge';
import { EnvironmentContext } from '../providers/EnvironmentContext';

interface IPkceChallenge {
  codeChallenge: string;
  codeVerifier: string;
}

function generateNewPkceChallenge() {
  const { code_challenge: codeChallenge, code_verifier: codeVerifier } =
    pkceChallenge();

  if (typeof window !== 'undefined') {
    window.localStorage.setItem('code_verifier', codeVerifier);
    window.localStorage.setItem('code_challenge', codeChallenge);
  }

  return { codeChallenge, codeVerifier };
}

function getPkceChallengeFromLocalStorage(): IPkceChallenge | undefined {
  if (typeof window === 'undefined') return undefined;

  const codeVerifier = window.localStorage.getItem('code_verifier');
  const codeChallenge = window.localStorage.getItem('code_challenge');

  if (!codeVerifier || !codeChallenge) return undefined;

  return { codeChallenge, codeVerifier };
}

export default function LoginButton() {
  const environment = useContext(EnvironmentContext);

  const logIn = () => {
    const { codeChallenge } = generateNewPkceChallenge();

    const url = new URL(environment.OW_AUTHORIZE_URL);
    url.searchParams.append('client_id', environment.CLIENT_ID);
    url.searchParams.append('redirect_uri', environment.REDIRECT_URI);
    url.searchParams.append('response_type', 'code');
    url.searchParams.append('scope', 'openid profile email');
    url.searchParams.append('code_challenge', codeChallenge);
    url.searchParams.append('code_challenge_method', 'S256');
    url.searchParams.append('response_mode', 'query');

    window.location.href = url.toString();
  };

  return (
    <button
      onClick={logIn}
      className='bg-owPrimary text-white font-bold py-2 px-4 rounded flex flex-row items-center justify-center gap-4'
    >
      <Image src='/ow-icon.png' alt='Logo' width={48} height={48} />
      <p className='md:text-3xl text-xl'>Logg Inn</p>
    </button>
  );
}
