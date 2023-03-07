'use client';

import { useBingoContext } from './game';

export default function BingoControls() {
  const { restart } = useBingoContext();

  return (
    <div className='flex flex-col items-stretch mt-8 gap-4'>
      <button
        className='bg-owSecondary text-background font-bold p-4 rounded-lg'
        onClick={restart}
      >
        Nytt Brett
      </button>
    </div>
  );
}
