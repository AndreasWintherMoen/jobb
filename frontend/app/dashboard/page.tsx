import database from '../../database';
import EventFilterHeader from './eventFilterHeader';
import EventList from './eventList';

export default async function DashboardPage() {
  const user = await database.fetchUser(1421);
  if (!user) return <div>Ikke logget inn</div>;
  const events = await database.fetchEvents();

  return (
    <div className='w-screen h-screen flex flex-col items-center'>
      <div className='max-w-4xl w-full mt-8 flex items-start gap-4'>
        <EventFilterHeader />
        <div className='grow'>
          <EventList events={events} />
        </div>
      </div>
    </div>
  );
}
