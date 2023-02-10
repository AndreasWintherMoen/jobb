'use client';

import React, { useState } from 'react';
import formatDate from '../../utils/date/formatDate';
import Event from '../../components/Event';
import { IEvent } from '../../database/models/Event';
import {
  DateFilter,
  EventTypeFilter,
  useEventFilterContext,
} from '../../providers/EventFilterContext';
import { parseEventType } from '../../utils/events/parseEventType';

interface IProps {
  events: IEvent[];
}

export default function EventList({ events }: IProps) {
  const { selectedDateFilter, selectedEventTypeFilter } =
    useEventFilterContext();

  const groupedEvents = events
    .filter(
      (event) =>
        !!event[selectedDateFilter] &&
        new Date(event[selectedDateFilter]).getTime() > new Date().getTime()
    )
    .reduce(groupEvents(selectedDateFilter, selectedEventTypeFilter), {});

  return (
    <>
      {Object.entries(groupedEvents).map(([date, events]) => (
        <div
          key={date}
          className='mb-4 px-2 py-2 rounded-lg font-bold bg-background-light'
        >
          <h3 className='text-xl mb-2 ml-1'>
            {selectedDateFilter === 'start_date' ? 'Starter ' : 'Påmelding '}{' '}
            {formatDate(date)}
          </h3>
          <ul className='flex flex-col gap-2'>
            {events.map((event: IEvent) => (
              <div
                key={event.id}
                // className='border-[2px] border-background-accent rounded-lg'
                className='bg-background-accent rounded-lg overflow-hidden pr-2'
              >
                <Event event={event} />
              </div>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}

interface IEventGroup {
  [key: string]: IEvent[];
}

function groupEvents(dateFilter: DateFilter, eventTypeFilter: EventTypeFilter) {
  return function (acc: IEventGroup, curr: IEvent) {
    if (
      eventTypeFilter !== 'alle' &&
      parseEventType(curr.event_type) !== eventTypeFilter
    )
      return acc;
    const dayOfYear = curr[dateFilter].split('T')[0];
    if (acc[dayOfYear]) {
      acc[dayOfYear].push(curr);
    } else {
      acc[dayOfYear] = [curr];
    }
    return acc;
  };
}
