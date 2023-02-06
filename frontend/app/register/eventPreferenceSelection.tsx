import EventTypeToggle from '../../components/EventTypeToggle';

export default function EventPreferenceSelectionPage() {
  return (
    <div className='max-w-7xl mx-auto md:mt-16 p-4 md:p-8 flex flex-col items-center bg-background text-textPrimary rounded-lg'>
      <h1 className='pb-2 md:pt-4 text-3xl md:text-4xl font-bold'>
        Velkommen!
      </h1>
      <h2 className='md:font-bold text-lg md:text-xl mb-4 md:mb-16'>
        Hvilke arrangementer vil du varsles om?
      </h2>
      <div className='w-full flex flex-col lg:flex-row lg:items-stretch grow-0 p-2 md:p-4 gap-2 md:gap-8'>
        <EventTypeToggle eventType='bedpres' />
        <EventTypeToggle eventType='kurs' />
        <EventTypeToggle eventType='sosialt' />
      </div>
      <p className='py-4 md:py-8 italic text-sm md:text-base'>
        Dette er bare en preferanse. Når du er logget inn kan du velge hvilke
        arrangementer du vil få varsling om.
      </p>
      <div className='flex gap-8'>
        <button className='mt-4 md:mt-8 bg-owSecondary text-background rounded-lg px-4 py-2 hover:bg-owSecondaryAccent'>
          Fullfør registrering
        </button>
      </div>
    </div>
  );
}
