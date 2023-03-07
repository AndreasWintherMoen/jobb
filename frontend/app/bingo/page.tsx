import BingoGame from './game';

export default function Bingo() {
  return (
    <div className='flex flex-col'>
      <h1 className='text-owSecondary text-3xl font-bold text-center mt-4 mb-8'>
        Bedpres Bingo
      </h1>
      <BingoGame />
    </div>
  );
}
