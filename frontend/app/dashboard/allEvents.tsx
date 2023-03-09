import database from '../../database';
import AllEventsList from './allEventsList';

export default async function AllEvents() {
  const events = await database.fetchEvents();
  return <AllEventsList events={events} />;
}
