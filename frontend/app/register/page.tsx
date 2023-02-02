export const dynamic = 'force-dynamic';

import auth from '../../auth';

import { headers } from 'next/headers';
import RegisterSteps from './registerSteps';

export default async function RegisterPage() {
  let owUser: any = {};
  let token: string | null = '';
  try {
    const nextHeaders = headers();
    token = nextHeaders.get('x-ow-token');
    owUser = await auth.fetchFullProfile(token || undefined);
  } catch (e: any) {
    return (
      <div>
        <p>No user</p>
        <p>Caught error: {e.message}</p>
        <p>Token: {token}</p>
      </div>
    );
  }
  if (!owUser || !owUser.phone_number) {
    return <div>no user</div>;
  }

  return <RegisterSteps owUser={owUser} />;
}
