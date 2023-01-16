import Image from 'next/image';

export default function LoadingSpinner() {
  return (
    <div className='w-screen h-screen grid place-content-center'>
      <Image
        src='/loading-spinner.svg'
        alt='Loading...'
        width={256}
        height={256}
      />
    </div>
  );
}
