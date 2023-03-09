import shuffleArray from '../../utils/shuffleArray';

// TODO: Load terms from a file
const bingoTerms = [
  'Reelt prosjekt',
  'Mye sosialt',
  'Buddy / mentor',
  'Faggrupper',
  'React',
  'Jenteandel',
  'Tur til utlandet',
  'Flinke folk',
  'Ungt miljø',
  'Greit å feile',
  'Shuffleboard',
  'Ta ned prod',
  'Kaffe',
  'Kake',
  'Sertifisering',
  'Overgang fra studiet',
  'Java',
  'C# og .NET',
  'Kotlin',
  'TypeScript',
  'Frontend utvikler',
  'Prøve meg på backend',
  'Studerte også informatikk på NTNU',
  'Viser bilde av ansatte med øl i hånden',
  'Konsulent-CV',
  'Graduate program',
  'Fleksitid',
];

export function getNewBingoTerms(): string[][] {
  shuffleArray(bingoTerms);
  return [
    [bingoTerms[0], bingoTerms[1], bingoTerms[2], bingoTerms[3]],
    [bingoTerms[4], bingoTerms[5], bingoTerms[6], bingoTerms[7]],
    [bingoTerms[8], bingoTerms[9], bingoTerms[10], bingoTerms[11]],
    [bingoTerms[12], bingoTerms[13], bingoTerms[14], bingoTerms[15]],
  ];
}

export function isBingo(board: boolean[][]): boolean {
  const row = board.some((row) => row.every((cell) => cell));
  const col = board[0].some((_, i) => board.every((row) => row[i]));
  const diag = board.every((_, i) => board[i][i]);
  const antiDiag = board.every((_, i) => board[i][board.length - i - 1]);
  return row || col || diag || antiDiag;
}
