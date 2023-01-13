'use client';

import React, { createContext } from 'react';
import pkceChallenge from 'pkce-challenge';

export interface IUser {
  username: string;
}

export interface IAuthContext {
  user?: IUser;
  isLoggedIn: boolean;
  logIn: () => void;
}

export const AuthContext = createContext<IAuthContext>({
  user: undefined,
  isLoggedIn: false,
  logIn: () => {},
});

const code_verifier =
  typeof window !== 'undefined'
    ? window.localStorage?.getItem('code_verifier')
    : null;

if (code_verifier !== null) {
  const url = new URL('https://old.online.ntnu.no/openid/token');

  const body = new FormData();
  body.append('client_id', '052697');
  body.append('redirect_uri', 'http://bedpresbot.online/');
  body.append('grant_type', 'authorization_code');
  body.append('code_verifier', code_verifier);

  if (typeof window !== 'undefined') {
    window.localStorage.removeItem('code_verifier');
    window.localStorage.removeItem('code_challenge');
  }

  fetch(url.toString(), {
    method: 'POST',
    body,
  });
}

function generatePkceStuff() {
  const { code_challenge, code_verifier } = pkceChallenge();
  if (typeof window !== 'undefined') {
    window.localStorage.setItem('code_verifier', code_verifier);
    window.localStorage.setItem('code_challenge', code_challenge);
  }
  console.log(
    `Generated code_verifier: ${code_verifier} and code_challenge: ${code_challenge}`
  );
}

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = React.useState<IUser>();
  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(false);

  const logIn = () => {
    //TODO: Implement login
    console.log('logging in ');
    generatePkceStuff();
    const code_challenge =
      typeof window !== 'undefined'
        ? window.localStorage?.getItem('code_challenge')
        : null;
    if (!code_challenge) throw new Error('code_challenge is null');
    const url = new URL('https://old.online.ntnu.no/openid/authorize');
    url.searchParams.append('client_id', '052697');
    url.searchParams.append('redirect_uri', 'http://bedpresbot.online/');
    url.searchParams.append('response_type', 'code');
    url.searchParams.append('scope', 'openid profile email');
    url.searchParams.append('state', 'b8f07c853c4e491c800790e6e18311a5');
    url.searchParams.append('code_challenge', code_challenge);
    url.searchParams.append('code_challenge_method', 'S256');
    url.searchParams.append('response_mode', 'query');

    window.location.href = url.toString();
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, logIn }}>
      {children}
    </AuthContext.Provider>
  );
}
