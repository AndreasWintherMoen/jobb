'use client';

import PrimaryButton from '../../components/PrimaryToggle';
import { useEventFilterContext } from '../../providers/EventFilterContext';

export default function FilterHeader() {
  const { selectedEventTypeFilter, setSelectedEventTypeFilter } =
    useEventFilterContext();
  return (
    <div className='flex p-1 gap-2'>
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
  );
}
