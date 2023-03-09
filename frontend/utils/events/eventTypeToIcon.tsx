import { EventIndex, EventType } from './types';
import BedpresIcon from '../../components/icons/BedpresIcon';
import KursIcon from '../../components/icons/KursIcon';
import SosialtIcon from '../../components/icons/SosialtIcon';
import { parseEventType } from './parseEventType';

const tailwindConfig = require('../../tailwind.config');

export default function eventTypeToIcon(
  eventType: EventType | EventIndex,
  options?: Options
) {
  if (typeof eventType === 'number') eventType = parseEventType(eventType);
  if (eventType === 'bedpres')
    return (
      <BedpresIcon
        color={options?.color ?? tailwindConfig.theme.colors.event.bedpres}
        width={options?.size ?? 36}
        height={options?.size ?? 36}
      />
    );
  if (eventType === 'kurs')
    return (
      <KursIcon
        color={options?.color ?? tailwindConfig.theme.colors.event.kurs}
        width={options?.size ?? 36}
        height={options?.size ?? 36}
      />
    );
  if (eventType === 'sosialt')
    return (
      <SosialtIcon
        color={options?.color ?? tailwindConfig.theme.colors.event.sosialt}
        width={options?.size ?? 36}
        height={options?.size ?? 36}
      />
    );
}

export type Options = {
  color?: string;
  size?: number;
};
