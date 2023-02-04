'use client';

import React, { useState } from 'react';
import EventPreferenceSelection from './eventPreferenceSelection';
import PhoneVerification from './phoneVerification';

export default function RegisterSteps({ owUser }: any) {
  const [step, setStep] = useState(1);

  if (step === 1) {
    return (
      <PhoneVerification
        phoneNumber={owUser.phone_number}
        onSuccess={() => setStep(2)}
      />
    );
  }
  if (step === 2) {
    return <EventPreferenceSelection />;
  }
  return <div></div>;
}
