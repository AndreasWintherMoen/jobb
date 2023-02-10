'use client';

import Image from 'next/image';
import { useState } from 'react';
import { IEvent } from '../database/models/Event';
import { useEventFilterContext } from '../providers/EventFilterContext';
import { getEventTime } from '../utils/date/formatDate';
import eventTypeToIcon from '../utils/events/eventTypeToIcon';
import { parseEventType } from '../utils/events/parseEventType';
import { EventIndex } from '../utils/events/types';
import PrimaryToggle from './PrimaryToggle';

interface IProps {
  event: IEvent;
}

export default function NewEvent({ event }: IProps) {
  const [sendNotification, setSendNotification] = useState(true);
  const { selectedDateFilter } = useEventFilterContext();
  const date = event[selectedDateFilter];

  const toggleNotifiation = () => {
    setSendNotification(!sendNotification);
  };

  return (
    <div className='flex items-stretch gap-4 border-owSecondary border-1'>
      <a
        target='_blank'
        href={`https://online.ntnu.no/events/${event.id}`}
        rel='noreferrer'
        className='w-full flex gap-4'
      >
        <div className='min-w-[228px] max-w-[228px] min-h-[128px] max-h-[128px] relative rounded-l-lg overflow-hidden'>
          <Image
            src={event.images?.[0]?.sm || getFallbackImage(event.event_type)}
            alt={event.title}
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
        <div className='w-full flex flex-col gap-4 py-4'>
          <div className='flex justify-start items-center gap-4'>
            {eventTypeToIcon(event.event_type, { size: 36 })}
            <h2 className='font-bold'>{event.title}</h2>
          </div>
          <div>
            <p className='font-normal line-clamp-2'>{event.ingress}</p>
          </div>
        </div>
      </a>
      <div className='min-w-[128px] flex flex-col justify-between text-center pt-4 pb-2 gap-2'>
        <p>Kl: {getEventTime(date)}</p>
        {selectedDateFilter === 'registration_start' ? (
          <PrimaryToggle
            selected={sendNotification}
            onClick={toggleNotifiation}
          >
            {sendNotification ? 'Slå av varsling' : 'Slå på varsling'}
          </PrimaryToggle>
        ) : (
          <AvailableSpaces event={event} />
        )}
      </div>
    </div>
  );
}

function AvailableSpaces({ event }: IProps) {
  const remainingSpaces = event.max_capacity - event.number_of_seats_taken;
  if (remainingSpaces === 0) {
    if (event.number_on_waitlist) {
      return (
        <p className='text-red-400 pb-2'>
          {event.number_on_waitlist} på venteliste
        </p>
      );
    }
    return <p className='text-red-400 pb-2'>Fullt</p>;
  }
  return (
    <p className='text-green-300 pb-2'>{remainingSpaces} ledige plasser</p>
  );
}

function getFallbackImage(eventType: EventIndex) {
  const parsedEventType = parseEventType(eventType);
  if (parsedEventType === 'bedpres') {
    return '/fallback-img-bedpres.png';
  }
  if (parsedEventType === 'kurs') {
    return '/fallback-img-kurs.png';
  }
  if (parsedEventType === 'sosialt') {
    return '/fallback-img-sosialt.png';
  }
  console.error('No fallback image found for event type', eventType);
  return '/fallback-img-bedpres.png';
}
