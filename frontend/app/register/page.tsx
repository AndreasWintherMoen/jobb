export const dynamic = 'force-dynamic';

// import React, { useState } from 'react';
import EventPreferenceSelection from './eventPreferenceSelection';
import PhoneVerification from './phoneVerification';
import auth from '../../auth';

import { headers } from 'next/headers';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function RegisterPage(stuff: any) {
  const nextHeaders = headers();
  const token = nextHeaders.get('x-ow-token');

  // const [step, setStep] = useState(0);
  let step = 1;
  console.log('page.tsx', stuff);

  // await delay(5000);
  let owUser;
  try {
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

  // const user = await database.fetchUser(1421);
  // if (!user || !user.phone_number) {
  //   return <div>no user</div>;
  // }

  // if (step === 0) {
  //   return <PhoneInput />; // TODO: Implement this
  // }
  if (step === 1) {
    return (
      <PhoneVerification
        tmpFullOwInfo={owUser}
        phone={owUser.phone_number}
        onSuccess={() => (step = 2)}
      />
    );
  }
  if (step === 2) {
    return <EventPreferenceSelection />;
  }
}
