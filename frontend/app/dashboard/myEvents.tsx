import { headers } from 'next/headers';
import database from '../../database';
import EventList from './myEventsList';

export default async function MyEvents() {
  try {
    const events = await database.fetchEvents();

    const nextHeaders = headers();
    const token = nextHeaders.get('x-ow-token');
    if (!token)
      return (
        <p className='text-xl italic mt-12'>
          Kunne ikke hente brukerinformasjon. OW token: {token}
        </p>
      );

    const myEventIds = await fetchMyEventIds(token);
    const eventsImAttending = events.filter((event) =>
      myEventIds.includes(event.id)
    );
    if (eventsImAttending.length === 0)
      return (
        <p className='text-xl italic mt-12'>
          Du er ikke meldt på noen arrangementer...
        </p>
      );

    return <EventList events={eventsImAttending} />;
  } catch (err) {
    console.error(err);
    return (
      <>
        <p className='text-xl italic mt-12'>Kunne ikke hente arrangementer</p>
      </>
    );
  }
}

async function fetchMyEventIds(token: string) {
  const pages = Array.from({ length: 3 }, (_, i) => i + 1);
  const urls = pages.map(
    (page) =>
      `https://old.online.ntnu.no/api/v1/event/attendance-events/?ordering=-registration_start&page=${page}`
  );
  const responses = await Promise.all(
    urls.map(async (url) =>
      fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    )
  );
  if (responses.some((res) => !res.ok))
    throw new Error('Kunne ikke hente arrangementer');

  const data = await Promise.all(responses.map((res) => res.json()));

  return data
    .reduce((acc, val) => acc.concat(val.results), [])
    .filter((event: any) => event.is_attendee)
    .map((event: any) => event.id);
}
