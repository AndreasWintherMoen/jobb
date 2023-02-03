'use client';

import React, { useEffect, useState } from 'react';
import VerificationCodeInput from '../../components/VerificationCodeInput';

export default function VerifyPhonePage({
  phone,
  onSuccess,
}: {
  phone: string;
  onSuccess: () => void;
}) {
  const [code, setCode] = useState('');

  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (code.length === 5) {
      submitVerificationCode()
        .then(onSuccess)
        .catch(() => setShowError(true));
    } else if (code.length > 0) {
      setShowError(false);
    } else {
      setCode(code.slice(0, 5));
    }
  }, [code, onSuccess, setShowError]);

  return (
    <div className='w-screen md:w-8/12 mx-auto mt-16 p-4 md:p-8 flex flex-col items-center bg-background text-textPrimary rounded-lg'>
      <h1 className='text-3xl md:text-4xl font-bold pb-4'>
        Bekreft telefonnummer
      </h1>
      <h2 className='font-bold text-lg md:text-xl mb-16'>
        Du skal ha fått en SMS til {phone}. Vennligst skriv inn koden du mottok.
      </h2>
      <VerificationCodeInput
        code={code}
        onChangeCode={setCode}
        error={showError}
      />
    </div>
  );
}

// TODO: Implement this
async function submitVerificationCode() {}
