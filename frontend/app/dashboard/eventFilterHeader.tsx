'use client';

import React, { useState } from 'react';
import PrimaryButton from '../../components/PrimaryToggle';
import { useEventFilterContext } from '../../providers/EventFilterContext';

// Kommende arrangementer - Kommende påmeldinger
// Alle arrangementer - Mine arrangementer
export default function EventFilterHeader() {
  const {
    selectedDateFilter,
    selectedEventTypeFilter,
    setSelectedDateFilter,
    setSelectedEventTypeFilter,
  } = useEventFilterContext();

  return (
    <div className='flex flex-col shrink items-stretch gap-4 bg-background-accent px-4 py-8 rounded-lg'>
      <div className='flex flex-col justify-start items-stretch gap-4'>
        {/* <h3 className='text-textAccent'>heisann</h3> */}
        <PrimaryButton
          selected={selectedDateFilter === 'registration_start'}
          onClick={() => setSelectedDateFilter('registration_start')}
        >
          Påmeldinger
        </PrimaryButton>
        <PrimaryButton
          selected={selectedDateFilter === 'start_date'}
          onClick={() => setSelectedDateFilter('start_date')}
        >
          Arrangementer
        </PrimaryButton>
      </div>
      {/* <Divider /> */}
      {/* <div className='flex flex-col justify-start items-stretch gap-4'>
        <PrimaryButton
          selected={second === 0}
          onClick={() => handleSecondClick(0)}
        >
          Alle
        </PrimaryButton>
        <PrimaryButton
          selected={second === 1}
          onClick={() => handleSecondClick(1)}
        >
          Ledige Plasser
        </PrimaryButton>
        <PrimaryButton
          selected={second === 2}
          onClick={() => handleSecondClick(2)}
        >
          Påmeldt
        </PrimaryButton>
      </div> */}
      <Divider />
      <div className='flex flex-col justify-start items-stretch gap-4'>
        <PrimaryButton
          selected={selectedEventTypeFilter === 'alle'}
          onClick={() => setSelectedEventTypeFilter('alle')}
          color='owSecondary'
        >
          Alle
        </PrimaryButton>
        <PrimaryButton
          selected={selectedEventTypeFilter === 'bedpres'}
          onClick={() => setSelectedEventTypeFilter('bedpres')}
          color='event-bedpres'
        >
          Bedpres
        </PrimaryButton>
        <PrimaryButton
          selected={selectedEventTypeFilter === 'kurs'}
          onClick={() => setSelectedEventTypeFilter('kurs')}
          color='event-kurs'
        >
          Kurs
        </PrimaryButton>
        <PrimaryButton
          selected={selectedEventTypeFilter === 'sosialt'}
          onClick={() => setSelectedEventTypeFilter('sosialt')}
          color='event-sosialt'
        >
          Sosialt
        </PrimaryButton>
      </div>
    </div>
  );
}

function Divider() {
  return <div className='w-full my-2 h-1 bg-background-light' />;
}
