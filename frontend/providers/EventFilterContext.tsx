import React, { createContext, useContext, useState } from 'react';
import { EventType } from '../utils/events/types';

export type DateFilter = 'start_date' | 'registration_start';
export type EventTypeFilter = EventType | 'alle';

export interface IEventFilterContext {
  selectedDateFilter: DateFilter;
  selectedEventTypeFilter: EventTypeFilter;
  setSelectedDateFilter: React.Dispatch<React.SetStateAction<DateFilter>>;
  setSelectedEventTypeFilter: React.Dispatch<
    React.SetStateAction<EventTypeFilter>
  >;
}

export const EventFilterContext = createContext<IEventFilterContext>({
  selectedDateFilter: 'start_date',
  selectedEventTypeFilter: 'alle',
  setSelectedDateFilter: () => {},
  setSelectedEventTypeFilter: () => {},
});

export const useEventFilterContext = () => useContext(EventFilterContext);

export default function EventFilterProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedDateFilter, setSelectedDateFilter] =
    useState<DateFilter>('registration_start');
  const [selectedEventTypeFilter, setSelectedEventTypeFilter] =
    useState<EventTypeFilter>('alle');

  return (
    <EventFilterContext.Provider
      value={{
        selectedDateFilter,
        selectedEventTypeFilter,
        setSelectedDateFilter,
        setSelectedEventTypeFilter,
      }}
    >
      {children}
    </EventFilterContext.Provider>
  );
}
