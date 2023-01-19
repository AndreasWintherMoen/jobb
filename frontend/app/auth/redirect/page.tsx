'use client';

import LoadingSpinner from '../../../components/LoadingSpinner';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { redirect } from 'next/navigation';

function fetchAccessToken(authCode?: string, codeVerifier?: string) {
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
    if (!!userInfo) {
      redirect('/dashboard');
    }
  }, [userInfo]);

  return <LoadingSpinner />;
}
