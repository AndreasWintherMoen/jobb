'use client';

import React, { createContext, useContext, useEffect } from 'react';
import pkceChallenge from 'pkce-challenge';
import { EnvironmentContext } from './EnvironmentContext';
import { useQuery } from 'react-query';

export interface IAuthContext {
  user?: IUser;
  isLoggedIn: boolean;
  accessToken?: string;
  logIn: () => void;
}

interface IPkceChallenge {
  codeChallenge: string;
  codeVerifier: string;
}

interface IJwtResponse {
  access_token: string;
  expires_in: number;
  id_token: string;
  refresh_token: string;
  token_type: string;
}

// TODO: Add more fields to this interface, based on OW response
export interface IUser {
  username: string;
}

export const AuthContext = createContext<IAuthContext>({
  user: undefined,
  isLoggedIn: false,
  accessToken: undefined,
  logIn: () => {},
});

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

function getAuthCodeFromUrl() {
  if (typeof window === 'undefined') return undefined;

  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');

  if (!code) return undefined;
  return code;
}

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = React.useState<IUser>();
  const environment = useContext(EnvironmentContext);
  const [pkceChallenge, setPkceChallenge] = React.useState<
    IPkceChallenge | undefined
  >(getPkceChallengeFromLocalStorage());
  const [authCode] = React.useState<string | undefined>(getAuthCodeFromUrl());

  const logIn = () => {
    const { codeChallenge, codeVerifier } = generateNewPkceChallenge();

    // TODO: Consider removing this, as we're redirecting the user anyway, thus losing the state
    setPkceChallenge({ codeChallenge, codeVerifier });

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

  function isRedirectedAfterLogin() {
    if (!pkceChallenge) return false;
    if (!authCode) return false;
    return true;
  }

  const requestAccessToken = async (): Promise<IJwtResponse | undefined> => {
    if (!isRedirectedAfterLogin()) return;

    const { codeVerifier } = pkceChallenge as IPkceChallenge;

    const url = new URL(environment.OW_TOKEN_URL);

    const body = new FormData();

    body.append('client_id', environment.CLIENT_ID);
    body.append('redirect_uri', environment.REDIRECT_URI);
    body.append('grant_type', 'authorization_code');
    body.append('code_verifier', codeVerifier);
    body.append('code', authCode as string);

    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('code_verifier');
      window.localStorage.removeItem('code_challenge');
    }

    const res = await fetch(url.toString(), {
      method: 'POST',
      body,
    });
    if (!res.ok) throw new Error('Failed to fetch access token');

    const data = await res.json();
    return data;
  };

  const { data: jwtData } = useQuery('jwtData', requestAccessToken, {
    retry: false,
  });

  useEffect(() => {
    if (!jwtData) return;
    if (!authCode) return;
    if (typeof window === 'undefined') return;
    window.location.href = 'https://bedpresbot.online/dashboard';
  }, [jwtData, authCode]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!jwtData?.access_token,
        accessToken: jwtData?.access_token,
        logIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
