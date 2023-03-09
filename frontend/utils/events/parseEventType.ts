import { EventIndex, EventType } from './types';

export const parseEventType = (index: EventIndex): EventType => {
  if (index === 1 || index === 4) return 'sosialt';
  if (index === 2) return 'bedpres';
  if (index === 3) return 'kurs';
  console.warn(
    `Unknown event index: ${index} in parseEventType. Defaulting to 'sosialt'`
  );
  return 'sosialt';
};
