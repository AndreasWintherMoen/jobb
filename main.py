from online import get_event_list, event_is_in_the_future
from db import Database

def is_relevant_event(event, db):
    if event['is_attendance_event'] == False:
        return False
    if not event_is_in_the_future(event['id']):
        return False
    if db.event_exists_in_database(event['id']):
        return False
    return True

def discover_new_bedpres_and_add_to_database(db):
    events = get_event_list()
    print(f"received {len(events)} events")
    events = [event for event in events if is_relevant_event(event, db)]
    print(f"filtered all events to {len(events)} events")
    db.add_events_to_database(events)

if __name__ == '__main__':
    database = Database()
    database.connect()
    discover_new_bedpres_and_add_to_database(database)
    database.disconnect()
