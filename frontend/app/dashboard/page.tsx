import { Suspense } from 'react';
import AllEvents from './allEvents';
import MyEvents from './myEvents';
import FilterHeader from './eventFilterHeader';
import UpcomingRegistrations from './upcomingRegistrations';

export default async function DashboardPage() {
  return (
    <div className='w-screen h-screen grid grid-rows-2 grid-cols-2 grid-flow-col gap-12 p-8'>
      <Card className='row-span-1 col-span-1'>
        <Header>Mine arrangementer</Header>
        <Suspense fallback={<SkeletonEventList numEvents={3} />}>
          {/* @ts-expect-error Server Component */}
          <MyEvents />
        </Suspense>
      </Card>
      <Card className='row-span-1 col-span-1'>
        <Header>Kommende påmeldinger</Header>
        <Suspense fallback={<SkeletonEventList numEvents={3} />}>
          {/* @ts-expect-error Server Component */}
          <UpcomingRegistrations />
        </Suspense>
      </Card>
      <Card className='row-span-2 col-span-1'>
        <div className='w-full flex justify-between'>
          <Header>Alle arrangementer</Header>
          <FilterHeader />
        </div>
        <Suspense fallback={<SkeletonEventList numEvents={10} />}>
          {/* @ts-expect-error Server Component */}
          <AllEvents />
        </Suspense>
      </Card>
    </div>
  );
}

function Card({ children, className }: any) {
  return (
    <div
      className={`bg-background-dark rounded-lg shadow-2xl p-4 ${className}`}
    >
      <div className='w-full h-full overflow-hidden'>{children}</div>
    </div>
  );
}

function Header({ children }: any) {
  return (
    <h2 className='text-4xl mb-4 font-bold text-owSecondary'>{children}</h2>
  );
}

function SkeletonEventList({ numEvents }: { numEvents: number }) {
  return (
    <div className='flex flex-col gap-4'>
      {Array.from({ length: numEvents }).map((_, i) => (
        <SkeletonEvent key={i} />
      ))}
    </div>
  );
}

function SkeletonEvent() {
  return (
    <div className='flex flex-col'>
      <div className='w-[150px] mt-4 ml-4 bg-background-light rounded-lg'></div>
      <div className='flex items-stretch gap-4 border-owSecondary border-1 p-4'>
        <div className='w-full flex flex-col gap-2 animate-pulse'>
          <div className='flex gap-2'>
            <div className='w-[36px] h-[36px] bg-background-light rounded-lg' />
            <div className='grow h-full py-1'>
              <div className='w-full h-full bg-background-light rounded-lg' />
            </div>
          </div>
          <div className='w-full h-[20px] pt-1'>
            <div className='w-full h-full bg-background-light rounded-lg' />
          </div>
          <div className='w-full h-[20px] pt-1'>
            <div className='w-full h-full bg-background-light rounded-lg' />
          </div>
        </div>
        <div className='min-w-[134px] flex flex-col justify-between text-center bg-background-light rounded-lg animate-pulse' />
      </div>
    </div>
  );
}
