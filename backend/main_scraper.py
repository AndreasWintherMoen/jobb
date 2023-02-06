from config.types import Event
from online import get_event_list, event_is_in_the_future, add_registration_dates_to_event
from db import Database
import logger

def is_relevant_event(event: Event) -> bool:
    logger.info(f"Analyzing event [{event['id']}] {event['title']}...")
    if event['is_attendance_event'] == False:
        return False
    if not event_is_in_the_future(event):
        return False
    return True

def discover_new_bedpres_and_add_to_database(data, context):
    logger.info("********* STARTING SCRAPER... *********")
    database = Database()
    database.connect()
    events = get_event_list()
    total_count = len(events)
    logger.info(f"Fetched {total_count} events")
    events = [event for event in events if is_relevant_event(event)]
    filtered_count = len(events)
    logger.info(f"Filtered {total_count} events to {filtered_count} events")
    events = [add_registration_dates_to_event(event) for event in events]
    already_added_events = [event for event in events if database.event_exists_in_database(event['id'])]
    new_events = [event for event in events if not database.event_exists_in_database(event['id'])]
    database.update_events_in_database(already_added_events)
    database.add_events_to_database(new_events)
    database.disconnect()
