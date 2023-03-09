'use client';

import React from 'react';
import formatDate, { getEventTime } from '../../utils/date/formatDate';
import { IEvent } from '../../database/models/Event';
import capitalize from '../../utils/capitalize';
import eventTypeToIcon from '../../utils/events/eventTypeToIcon';
import PrimaryButton from '../../components/PrimaryToggle';
import Image from 'next/image';

interface IProps {
  events: IEvent[];
}

export default function EventList({ events }: IProps) {
  return (
    <div className='max-h-full overflow-scroll pb-8'>
      {events.map((event: IEvent) => (
        <div key={event.id} className='mb-4 px-2 py-2 rounded-lg font-bold'>
          <h3 className='text-xl font-light mb-2 ml-1'>
            {capitalize(formatDate(event['start_date']))}{' '}
            {getEventTime(event['start_date'])}
          </h3>
          <div className='bg-background rounded-lg overflow-hidden pr-2'>
            <Event event={event} />
          </div>
        </div>
      ))}
    </div>
  );
}

function Event({ event }: { event: IEvent }) {
  return (
    <div className='flex items-stretch gap-2 border-owSecondary border-1 p-2'>
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
      <div className='min-w-[134px] flex flex-col self-center text-center items-center'>
        <Image src='/location2.svg' width={30} height={30} alt='location' />
        <p className='font-normal'>{event.location}</p>
      </div>
    </div>
  );
}
