'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import BingoBoard from './board';
import BingoControls from './controls';
import { getNewBingoTerms, isBingo } from './utils';
import Confetti from 'react-confetti';

export type BingoContextType = {
  cells: string[][];
  selected: boolean[][];
  toggleCell: (row: number, col: number) => void;
  restart: () => void;
};

export const BingoContext = createContext<BingoContextType>({
  cells: [],
  selected: [],
  toggleCell: () => {},
  restart: () => {},
});

export const useBingoContext = () => {
  return useContext(BingoContext);
};

export default function BingoGame() {
  const [cells, setCells] = useState<string[][]>(getNewBingoTerms());
  const [selected, setSelected] = useState<boolean[][]>(
    generateFalseBoolean2DArray()
  );
  const [hasBingo, setHasBingo] = useState(false);

  // Because we randomize the board on render, we must do this to ensure client and server render the same thing
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);
  if (!hydrated) {
    // Returns null on first render, so the client and server match
    return null;
  }
  const toggleCell = (row: number, col: number) => {
    if (hasBingo) return;
    const newSelected = [...selected];
    newSelected[row][col] = !newSelected[row][col];
    setSelected(newSelected);
    if (isBingo(newSelected)) {
      setHasBingo(true);
    }
  };

  const restart = () => {
    setSelected(generateFalseBoolean2DArray());
    setCells(getNewBingoTerms());
    setHasBingo(false);
  };

  return (
    <BingoContext.Provider value={{ cells, selected, toggleCell, restart }}>
      <BingoBoard />
      <BingoControls />
      <Confetti opacity={hasBingo ? 1 : 0} />
    </BingoContext.Provider>
  );
}

function generateFalseBoolean2DArray() {
  const rows = 4;
  const cols = 4;
  const output = new Array(rows);
  for (let i = 0; i < rows; i++) {
    output[i] = new Array(cols).fill(false);
  }
  return output;
}
