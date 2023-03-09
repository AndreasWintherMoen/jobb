import auth from '../../auth';
import database from '../../database';
import EventList from './upcomingRegistrationsEventsList';

export default async function UpcomingRegistrations() {
  const events = await database.fetchUpcomingRegistrations();

  // TODO: Implement this with dynamic id from OAuth
  // const user = await auth.fetchUser();
  // const exclusions = await database.fetchExclusions(user.sub);
  const exclusions = await database.fetchExclusions(1421);

  const eventsWithNotificationStatus = events.map((event) => {
    const sendNotification = exclusions.every(
      (exclusion) => exclusion.event_id !== event.id
    );
    return {
      ...event,
      sendNotification,
    };
  });

  return <EventList events={eventsWithNotificationStatus} />;
}
