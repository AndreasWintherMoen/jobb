import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from './utils/crypto';
import cryptoModule from './utils/crypto/nextEdgeRuntimCryptoModule';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token');

  if (!token?.value) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-ow-token', 'No token found');
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  try {
    const decryptedToken = await decrypt(token.value, cryptoModule);
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-ow-token', decryptedToken);
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (e) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-ow-token', `Error decrypting token.... Error: ${e}`);
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }
}
