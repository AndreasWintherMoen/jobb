// A context provider for environment variables exposed to the client. These are opaque to the end-user. Secret
// environment variables such as API keys must be used in server components and accessed directly via process.env.

'use client';

import React, { createContext, useEffect, useState } from 'react';

export interface IEnvironmentContext {
  OW_AUTHORIZE_URL: string;
  OW_TOKEN_URL: string;
  CLIENT_ID: string;
  REDIRECT_URI: string;
}

export const EnvironmentContext = createContext<IEnvironmentContext>({
  OW_AUTHORIZE_URL: '',
  OW_TOKEN_URL: '',
  CLIENT_ID: '',
  REDIRECT_URI: '',
});

export function EnvironmentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [environment] = useState<IEnvironmentContext>({
    OW_AUTHORIZE_URL: process.env.NEXT_PUBLIC_OW_AUTHORIZE_URL || '',
    OW_TOKEN_URL: process.env.NEXT_PUBLIC_OW_TOKEN_URL || '',
    CLIENT_ID: process.env.NEXT_PUBLIC_CLIENT_ID || '',
    REDIRECT_URI: process.env.NEXT_PUBLIC_REDIRECT_URI || '',
  });

  useEffect(() => {
    if (environment.OW_AUTHORIZE_URL === '') {
      console.error('OW_AUTHORIZE_URL is not set');
    }
    if (environment.OW_TOKEN_URL === '') {
      console.error('OW_TOKEN_URL is not set');
    }
    if (environment.CLIENT_ID === '') {
      console.error('CLIENT_ID is not set');
    }
    if (environment.REDIRECT_URI === '') {
      console.error('REDIRECT_URI is not set');
    }
  }, [environment]);

  return (
    <EnvironmentContext.Provider value={environment}>
      {children}
    </EnvironmentContext.Provider>
  );
}
