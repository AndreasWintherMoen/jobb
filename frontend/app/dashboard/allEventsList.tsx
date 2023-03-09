'use client';

import { IEvent } from '../../database/models/Event';
import {
  EventTypeFilter,
  useEventFilterContext,
} from '../../providers/EventFilterContext';
import formatDate from '../../utils/date/formatDate';
import { parseEventType } from '../../utils/events/parseEventType';
import capitalize from '../../utils/capitalize';
import { getEventTime } from '../../utils/date/formatDate';
import eventTypeToIcon from '../../utils/events/eventTypeToIcon';

export default function EventList({ events }: { events: IEvent[] }) {
  const { selectedEventTypeFilter } = useEventFilterContext();

  const groupedEvents = events.reduce(groupEvents(selectedEventTypeFilter), {});

  return (
    <div className='max-h-full overflow-scroll pb-8'>
      {Object.entries(groupedEvents).map(([date, events]) => (
        <div key={date} className='mb-4 px-2 py-2 rounded-lg font-bold'>
          <h3 className='text-xl font-light mb-2 ml-1'>
            {capitalize(formatDate(date))}
          </h3>
          <ul className='flex flex-col gap-2'>
            {events.map((event: IEvent) => (
              <div
                key={event.id}
                className='bg-background rounded-lg overflow-y-hidden pr-2'
              >
                <Event event={event} />
              </div>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

interface IEventGroup {
  [key: string]: IEvent[];
}

function groupEvents(eventTypeFilter: EventTypeFilter) {
  return function (acc: IEventGroup, curr: IEvent) {
    if (
      eventTypeFilter !== 'alle' &&
      parseEventType(curr.event_type) !== eventTypeFilter
    )
      return acc;
    const dayOfYear = curr['start_date'].split('T')[0];
    if (acc[dayOfYear]) {
      acc[dayOfYear].push(curr);
    } else {
      acc[dayOfYear] = [curr];
    }
    return acc;
  };
}

function Event({ event }: { event: IEvent }) {
  return (
    <div className='flex items-stretch content-center gap-2 border-owSecondary border-1 p-2'>
      <a
        target='_blank'
        href={`https://online.ntnu.no/events/${event.id}`}
        rel='noreferrer'
        className='w-full flex gap-4'
      >
        <div className='w-full flex flex-col gap-2'>
          <div className='flex justify-start items-center gap-2'>
            {eventTypeToIcon(event.event_type, { size: 36 })}
            <h2 className='font-bold line-clamp-1'>{event.title}</h2>
          </div>
          <p className='font-normal line-clamp-2'>{event.ingress}</p>
        </div>
      </a>
      <div className='min-w-[134px] h-full flex flex-col self-center justify-center text-center gap-2'>
        <p>Kl: {getEventTime(event['start_date'])}</p>
        <AvailableSpaces event={event} />
      </div>
    </div>
  );
}

function AvailableSpaces({ event }: { event: IEvent }) {
  if (new Date(event.registration_end).getTime() < new Date().getTime()) {
    return <p className='text-red-300 font-normal'>Påmelding er stengt</p>;
  }
  const remainingSpaces = event.max_capacity - event.number_of_seats_taken;
  if (remainingSpaces === 0) {
    if (typeof event.number_on_waitlist === 'number') {
      return (
        <p className='pb-2 text-red-300'>
          {event.number_on_waitlist} på venteliste
        </p>
      );
    }
    return <p className='pb-2 text-red-300'>Fullt</p>;
  }
  return (
    <p className='pb-2 text-green-300'>{remainingSpaces} ledige plasser</p>
  );
}
