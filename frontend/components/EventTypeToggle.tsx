'use client';

import Image from 'next/image';
import React, { useState } from 'react';

// TODO: Consider moving this type definition somewhere else
type EventType = 'bedpres' | 'kurs' | 'sosialt';

export default function EventToggle({ eventType }: { eventType: EventType }) {
  const [isToggled, setIsToggled] = useState(true);

  const toggle = () => {
    setIsToggled(!isToggled);
  };

  return (
    <Border eventType={eventType} isToggled={isToggled} toggle={toggle}>
      {isToggled && <CheckMark eventType={eventType} />}
      <Content eventType={eventType} />
    </Border>
  );
}

function Content({ eventType }: { eventType: EventType }) {
  // TODO: Consider moving this to a json file or possibly Vercel's edge config.
  const eventTypeToTitle = {
    bedpres: 'Bedriftspresentasjoner',
    kurs: 'Kurs',
    sosialt: 'Sosiale arrangementer',
  };
  const eventTypeToDescription = {
    bedpres:
      'En bedrift kommer og forteller om arbeidsplassen og presenterer sommerjobber. Deretter drar vi på restaurant og får gratis mat og drikke.',
    kurs: 'Litt som bedpres, men med et faglig kurs før mat og drikke. Her kan du lære noe arbeidsrelevant som man kanskje ikke lærer på studiet.',
    sosialt:
      'Alle andre sosiale arrangementer. Dette kan være alt fra store events som surfing i Portugal eller ski i Åre, til mindre events som Go-kart eller casino-kveld.',
  };
  return (
    <>
      <h3 className='text-owSecondary font-bold select-none mt-6 text-xl p-2 text-center rounded-md'>
        {eventTypeToTitle[eventType]}
      </h3>
      <p className='font-bold select-none px-4 py-8'>
        {eventTypeToDescription[eventType]}
      </p>
    </>
  );
}

function CheckMark({ eventType }: { eventType: EventType }) {
  const eventTypeToStyle = {
    bedpres: 'border-t-event-bedpres border-l-event-bedpres',
    kurs: 'border-t-event-kurs border-l-event-kurs',
    sosialt: 'border-t-event-sosialt border-l-event-sosialt',
  };
  return (
    <div className='absolute'>
      <div
        className={`${eventTypeToStyle[eventType]} absolute top-0 left-0 h-8 w-8 border-[24px] border-transparent text-textPrimary`}
      />
      <Image
        src='/checkmark.svg'
        width={24}
        height={24}
        alt='checkmark'
        className='relative top-1 left-1'
      />
    </div>
  );
}

function Border({
  children,
  isToggled,
  toggle,
  eventType,
}: {
  children: React.ReactNode;
  isToggled: boolean;
  toggle: () => void;
  eventType: EventType;
}) {
  const eventTypeToBorderStyle = {
    bedpres: 'border-event-bedpres',
    kurs: 'border-event-kurs',
    sosialt: 'border-event-sosialt',
  };
  let styling = '';
  if (isToggled)
    styling = `${eventTypeToBorderStyle[eventType]} bg-background-accent overflow-hidden cursor-pointer box-border basis-1/3 border-4 border-opacity-100 rounded-lg`;
  else
    styling =
      'bg-background-accent overflow-hidden cursor-pointer box-border basis-1/3 border-4 border-background border-opacity-0 rounded-lg';
  return (
    <div onClick={toggle} className={styling}>
      {children}
    </div>
  );
}