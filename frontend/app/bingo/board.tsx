'use client';

import { useBingoContext } from './game';

export default function BingoBoard() {
  const { cells, selected, toggleCell } = useBingoContext();

  const completedStyling = 'bg-owSecondary text-background';

  return (
    <div className='w-full h-[100vw] flex flex-col'>
      {cells.map((row, i) => (
        <div className='flex flex-row grow basis-0' key={i}>
          {row.map((term, j) => (
            <div
              className={
                `flex flex-col grow basis-0 font-sm text-center justify-center border-2 border-neutral-300` +
                (selected[i][j] && ` ${completedStyling}`)
              }
              key={j}
              onClick={() => toggleCell(i, j)}
            >
              {term}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
