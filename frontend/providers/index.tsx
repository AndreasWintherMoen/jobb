'use client';

// import AuthProvider from './AuthContext';
import EnvironmentProvider from './EnvironmentContext';
import { ReactQueryProvider } from './ReactQueryProvider';
import EventFilterProvider from './EventFilterContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <EnvironmentProvider>
      <ReactQueryProvider>
        <EventFilterProvider>{children}</EventFilterProvider>
      </ReactQueryProvider>
    </EnvironmentProvider>
  );
}
