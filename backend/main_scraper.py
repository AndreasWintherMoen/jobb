from online import get_event_list, event_is_in_the_future, add_registration_start_to_event
from db import Database
import logging
import google.cloud.logging

logging.basicConfig(level=logging.DEBUG, format='[%(asctime)s] %(levelname)s: %(message)s')
gc_logging_client = google.cloud.logging.Client()
gc_logging_client.setup_logging()

def is_relevant_event(event, db):
    logging.info(f"Analyzing event [{event['id']}] {event['title']}...")
    if event['is_attendance_event'] == False:
        return False
    if not event_is_in_the_future(event['id']):
        return False
    return True

def discover_new_bedpres_and_add_to_database(data, context):
    logging.info("********* STARTING SCRAPER... *********")
    logging.info("Discovering new bedpres events...")
    database = Database()
    database.connect()
    events = get_event_list()
    total_count = len(events)
    logging.info(f"Fetched {total_count} events")
    events = [event for event in events if is_relevant_event(event, database)]
    filtered_count = len(events)
    logging.info(f"Filtered {total_count} events to {filtered_count} events")
    events = [add_registration_start_to_event(event) for event in events]
    already_added_events = [event for event in events if database.event_exists_in_database(event['id'])]
    new_events = [event for event in events if not database.event_exists_in_database(event['id'])]
    database.update_events_in_database(already_added_events)
    database.add_events_to_database(new_events)
    database.disconnect()
