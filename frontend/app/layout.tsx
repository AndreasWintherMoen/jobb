import './globals.css';
import Providers from '../providers';

// import { AuthProvider } from 'react-oidc-context';

// const oidcConfig = {
//   issuer: 'https://old.online.ntnu.no/openid/.well-known/openid-configuration',
//   authority:
//     'https://old.online.ntnu.no/openid/.well-known/openid-configuration',
//   client_id: '052697',
//   redirect_uri: 'http://bedpresbot.online/',
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <head />
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
