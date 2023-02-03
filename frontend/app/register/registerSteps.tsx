'use client';

import React, { useState } from 'react';
import { useQuery } from 'react-query';
import EventPreferenceSelection from './eventPreferenceSelection';
import PhoneVerification from './phoneVerification';

export default function RegisterSteps({ owUser }: any) {
  const [step, setStep] = useState(1);

  useQuery('sendPhoneVerification', () =>
    fetch('/api/sms/verification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber: owUser.phone_number,
      }),
    })
  );

  if (step === 1) {
    return (
      <PhoneVerification
        phone={owUser.phone_number}
        onSuccess={() => setStep(2)}
      />
    );
  }
  if (step === 2) {
    return <EventPreferenceSelection />;
  }
  return <div></div>;
}
