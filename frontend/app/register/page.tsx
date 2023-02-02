export const dynamic = 'force-dynamic';

// import React, { useState } from 'react';
import auth from '../../auth';

import { headers } from 'next/headers';
import RegisterSteps from './registerSteps';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function RegisterPage(stuff: any) {
  const nextHeaders = headers();
  const token = nextHeaders.get('x-ow-token');

  // const [step, setStep] = useState(0);
  let step = 1;
  console.log('page.tsx', stuff);

  // await delay(5000);
  let owUser: any = {};
  let token: string | null = '';
  try {
    const nextHeaders = headers();
    token = nextHeaders.get('x-ow-token');
    owUser = await auth.fetchFullProfile(token || undefined);
  } catch (e: any) {
    console.error(e);
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

  // const user = await database.fetchUser(1421);
  // if (!user || !user.phone_number) {
  //   return <div>no user</div>;
  // }

  // if (step === 0) {
  //   return <PhoneInput />; // TODO: Implement this
  // }
}
