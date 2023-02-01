'use client';

import LoadingSpinner from '../../../components/LoadingSpinner';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { redirect, useRouter } from 'next/navigation';
import { IJwtResponse } from '../../../auth/types';

async function fetchAccessToken(authCode?: string, codeVerifier?: string) {
  const res = await fetch('/api/auth/accessToken', {
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

  const jwtData = (await res.json()) as IJwtResponse;

  if (document && jwtData && jwtData.access_token && jwtData.refresh_token) {
    document.cookie = `access_token=${jwtData.access_token};path=/`;
    document.cookie = `refresh_token=${jwtData.refresh_token};path=/`;
  }

  return jwtData;
}

async function fetchUser(authCode?: string, codeVerifier?: string) {
  if (!authCode || !codeVerifier) {
    throw new Error('no authCode or codeVerifier in localStorage');
  }

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

export default function RedirectPage() {
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

  const router = useRouter();

  const { data: userInfo, error } = useQuery(
    'userInfo',
    () => fetchUser(authCode, codeVerifier),
    {
      retry: false,
    }
  );

  useEffect(() => {
    if (error) {
      alert(`Kunne ikke logge inn.\n\n${error}`);
      redirect('/');
    }
  }, [error]);

  useEffect(() => {
    if (!!userInfo && router) {
      // TODO: Redirect to register/dashboard depending on whether the user is new or not
      router.push('/register');
      // router.push('/dashboard');
    }
  }, [userInfo, router]);

  return <LoadingSpinner />;
}
