'use client';

import React, { useEffect, useRef } from 'react';
import { motion, useAnimationControls } from 'framer-motion';

export default function VerificationCodeInput({
  error,
  code,
  onChangeCode,
}: {
  error: string | null;
  code: string;
  onChangeCode: React.Dispatch<React.SetStateAction<string>>;
}) {
  const errorAnimationControls = useAnimationControls();

  const inputRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (error) {
      inputRef.current[0]?.focus();
      errorAnimationControls.start({
        x: [
          '0px',
          '10px',
          '0px',
          '-10px',
          '0px',
          '10px',
          '0px',
          '-10px',
          '0px',
        ],
      });
    }
  }, [error, errorAnimationControls]);

  useEffect(() => {
    inputRef.current[code.length]?.focus();
    if (code.length >= 5) {
      inputRef.current[4]?.blur();
    }
  }, [inputRef, code]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (value.length > 1) {
      if (!error) {
        const filteredValue = value.replace(/[^0-9]/g, '');
        const newCode = code + filteredValue;
        onChangeCode(newCode);
        return;
      }
      onChangeCode(value.charAt(value.length - 1));
      inputRef.current.forEach((input) => {
        if (input && input) input.value = '';
      });
      return;
    }
    onChangeCode((prev) => prev + value);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      onChangeCode((prev) => prev.slice(0, -1));
    }
  };

  return (
    <>
      <motion.div
        animate={errorAnimationControls}
        initial={false}
        transition={{ duration: 0.2 }}
        className='w-full flex justify-center grow-0 pt-4 gap-2 md:gap-8 p-4 md:px-8'
      >
        <SingleNumberInput
          index={0}
          code={code}
          onChange={handleInput}
          onKeyDown={onKeyDown}
          inputRef={inputRef}
          error={error}
        />
        <SingleNumberInput
          index={1}
          code={code}
          onChange={handleInput}
          onKeyDown={onKeyDown}
          inputRef={inputRef}
          error={error}
        />
        <SingleNumberInput
          index={2}
          code={code}
          onChange={handleInput}
          onKeyDown={onKeyDown}
          inputRef={inputRef}
          error={error}
        />
        <SingleNumberInput
          index={3}
          code={code}
          onChange={handleInput}
          onKeyDown={onKeyDown}
          inputRef={inputRef}
          error={error}
        />
        <SingleNumberInput
          index={4}
          code={code}
          onChange={handleInput}
          onKeyDown={onKeyDown}
          inputRef={inputRef}
          error={error}
        />
      </motion.div>
      {error && (
        <p className='py-8 italic text-error'>
          {error ?? 'Koden du skrev inn er feil. Vennligst prøv igjen.'}
        </p>
      )}
    </>
  );
}

function SingleNumberInput({
  index,
  code,
  onChange,
  onKeyDown,
  inputRef,
  error,
}: any) {
  return (
    <div className='grow md:grow-0 md:w-16 h-16 md:h-24 }'>
      <input
        type='text'
        className={`w-full h-full text-4xl md:text-6xl text-center p-1 md:p-2 rounded-lg border-2 ${
          error ? 'border-error outline-0' : 'border-textPrimary'
        }`}
        ref={(el) => (inputRef.current[index] = el)}
        onChange={onChange}
        onKeyDown={onKeyDown}
        value={code[index]}
        inputMode='numeric'
        pattern='[0-9]*'
        autoComplete='one-time-code'
        disabled={code.length !== index && (index !== 0 || !error)}
        style={{ caretColor: 'transparent' }}
      />
    </div>
  );
}
