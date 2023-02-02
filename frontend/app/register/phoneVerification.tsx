'use client';

import React, { useEffect, useState } from 'react';
import VerificationCodeInput from '../../components/VerificationCodeInput';

export default function VerifyPhonePage({
  phone,
  tmpFullOwInfo,
  onSuccess,
}: {
  phone: string;
  tmpFullOwInfo: any;
  onSuccess: () => void;
}) {
  // const phone = '12312312'; // temporary
  const [code, setCode] = useState('');

  const [showError, setShowError] = useState(false);

  console.log(tmpFullOwInfo);

  useEffect(() => {
    if (code.length === 5) {
      // TODO: send code to backend and set error if code is wrong
      // fetch('/api/verifyPhone', ...);
      Math.random() < 0.5 ? setShowError(true) : onSuccess();
    } else if (code.length > 0) {
      setShowError(false);
    }
  }, [code]);

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
