'use client';

import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import VerificationCodeInput from '../../components/VerificationCodeInput';

export default function VerifyPhonePage({
  phoneNumber,
  onSuccess,
}: {
  phoneNumber: string;
  onSuccess: () => void;
}) {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { data } = useQuery('sendPhoneVerification', () =>
    fetch('/api/sms/otp/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber,
      }),
    })
      .then((res) => res.json())
      .catch((err) => setError(err?.error || 'Noe gikk galt'))
  );

  useEffect(() => {
    if (code.length === 5) {
      if (data?.cipher === undefined) return;
      submitVerificationCode(code, phoneNumber, data.cipher)
        .then(onSuccess)
        .catch((err) => setError(err.message));
    } else if (code.length > 0) {
      setError(null);
    } else {
      setCode(code.slice(0, 5));
    }
  }, [code, data, onSuccess, setError, phoneNumber, setCode]);

  return (
    <div className='w-screen md:w-8/12 mx-auto mt-16 p-4 md:p-8 flex flex-col items-center bg-background text-textPrimary rounded-lg'>
      <h1 className='text-3xl md:text-4xl font-bold pb-4'>
        Bekreft telefonnummer
      </h1>
      <h2 className='font-bold text-lg md:text-xl mb-16'>
        Du skal ha fått en SMS til {phoneNumber}. Vennligst skriv inn koden du
        mottok.
      </h2>
      {error && <p className='text-error'>{error}</p>}
      <VerificationCodeInput code={code} onChangeCode={setCode} error={error} />
    </div>
  );
}

async function submitVerificationCode(
  code: string,
  phoneNumber: string,
  cipher: string
) {
  const response = await fetch('/api/sms/otp/verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      code,
      phoneNumber,
      cipher,
    }),
  });

  if (response.status === 401) {
    throw new Error('Koden du skrev inn er feil. Vennligst prøv igjen.');
  }
  if (response.status === 410) {
    throw new Error('Verifiseringskoden har utløpt');
  }
  if (!response.ok) {
    throw new Error('Koden du skrev inn er feil. Vennligst prøv igjen.');
  }
  return response.json();
}
