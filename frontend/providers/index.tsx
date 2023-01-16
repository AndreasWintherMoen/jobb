'use client';

import AuthProvider from './AuthContext';
import { EnvironmentProvider } from './EnvironmentContext';
import { ReactQueryProvider } from './ReactQueryProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <EnvironmentProvider>
      <ReactQueryProvider>
        <AuthProvider>{children}</AuthProvider>
      </ReactQueryProvider>
    </EnvironmentProvider>
  );
}
