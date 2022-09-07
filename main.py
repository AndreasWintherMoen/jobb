from online import get_event_list, event_is_in_the_future, add_registration_start_to_event
from db import Database

def is_relevant_event(event, db):
    print(f"Analyzing event [{event['id']}] {event['title']}...")
    if event['is_attendance_event'] == False:
        return False
    if not event_is_in_the_future(event['id']):
        return False
    if db.event_exists_in_database(event['id']):
        return False
    return True

def discover_new_bedpres_and_add_to_database(db):
    events = get_event_list()
    total_count = len(events)
    print(f"Fetched {total_count} events")
    events = [event for event in events if is_relevant_event(event, db)]
    filtered_count = len(events)
    print(f"Filtered {total_count} events to {filtered_count} events")
    events = [add_registration_start_to_event(event) for event in events]
    db.add_events_to_database(events)

if __name__ == '__main__':
    database = Database()
    database.connect()
    discover_new_bedpres_and_add_to_database(database)
    database.disconnect()
