import EventTypeToggle from '../../components/EventTypeToggle';

export default function RegisterPage() {
  return (
    <div className='w-8/12 mx-auto mt-16 p-8 flex flex-col items-center bg-background text-textPrimary rounded-lg'>
      <h1 className='text-4xl font-bold'>Velkommen!</h1>
      <h2 className='font-bold text-xl mb-16'>
        Hvilke arrangementer vil du ha varsling om?
      </h2>
      <div className='w-full flex grow-0 p-4 gap-8'>
        <EventTypeToggle eventType='bedpres' />
        <EventTypeToggle eventType='kurs' />
        <EventTypeToggle eventType='sosialt' />
      </div>
      <p className='py-8 italic'>
        Dette er bare en preferanse. Når du er logget kan du velge spesifikt
        hvilke arrangementer du vil få varsling om.
      </p>
      <div className='flex gap-8'>
        <button className='mt-8 bg-owSecondary text-background rounded-lg px-4 py-2 hover:bg-owSecondaryAccent'>
          Fullfør registrering
        </button>
      </div>
    </div>
  );
}
