from scheduler import schedule_external_sms_sender
from db import Database
import logging
import google.cloud.logging
from enums import MessageType
from utils import get_delay_until_five_minutes_before_event, get_delay_until_one_hour_before_event

logging.basicConfig(level=logging.DEBUG, format='[%(asctime)s] %(levelname)s: %(message)s')
gc_logging_client = google.cloud.logging.Client()
gc_logging_client.setup_logging()

def get_todays_events():
    database = Database()
    database.connect()
    register_events = database.get_todays_register_events_from_database()
    unattend_events = database.get_todays_unattend_events_from_database()
    start_events    = database.get_todays_start_events_from_database()
    database.disconnect()
    return register_events, unattend_events, start_events

def schedule_sms_for_todays_events(data, context):
    logging.info("********* SCHEDULING SMS FOR TODAY... *********")
    register_events, unattend_events, start_events = get_todays_events()
    logging.info(f"Found {len(register_events)} register events, {len(unattend_events)} unattend events and {len(start_events)} start events to schedule SMS for")
    for date in register_events:
        time_to_send = get_delay_until_five_minutes_before_event(date)
        events = register_events[date]
        event_ids = [event['id'] for event in events]
        logging.info(f"Sending sms for register events {[event['title'] for event in events]} at {date} in {time_to_send} seconds")
        schedule_external_sms_sender(event_ids, MessageType.REGISTRATION_START, time_to_send)
    for date in unattend_events:
        time_to_send = get_delay_until_one_hour_before_event(date)
        events = unattend_events[date]
        event_ids = [event['id'] for event in events]
        logging.info(f"Sending sms for unattend events {[event['title'] for event in events]} at {date} in {time_to_send} seconds")
        schedule_external_sms_sender(event_ids, MessageType.UNATTEND, time_to_send)
    for date in start_events:
        time_to_send = get_delay_until_one_hour_before_event(date)
        events = start_events[date]
        event_ids = [event['id'] for event in events]
        logging.info(f"Sending sms for start events {[event['title'] for event in events]} at {date} in {time_to_send} seconds")
        schedule_external_sms_sender(event_ids, MessageType.EVENT_START, time_to_send)

    return 'OK'
