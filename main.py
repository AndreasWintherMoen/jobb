from online import get_event_list, event_is_in_the_future
from db import Database

def discover_new_bedpres_and_add_to_database(db):
    events = get_event_list()
    print(f"received {len(events)} events")
    events = [e for e in events if event_is_in_the_future(e['id']) and not db.event_exists_in_database(e['id'])]
    print(f"filtered all events to {len(events)} events")
    db.add_events_to_database(events)

if __name__ == '__main__':
    database = Database()
    database.connect()
    discover_new_bedpres_and_add_to_database(database)
    database.disconnect()
