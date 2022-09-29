from scheduler import schedule_external_sms_sender
from db import Database
import logging
import google.cloud.logging
from utils import format_message_for_events, get_delay_until_five_minutes_before_event

logging.basicConfig(level=logging.DEBUG, format='[%(asctime)s] %(levelname)s: %(message)s')
gc_logging_client = google.cloud.logging.Client()
gc_logging_client.setup_logging()

def schedule_sms_for_todays_events(data, context):
    logging.info("********* SCHEDULING SMS FOR TODAY... *********")
    database = Database()
    database.connect()
    events = database.get_todays_events_from_database()
    database.disconnect()
    logging.info(f"Found {len(events)} events to schedule SMS for")
    for date in events:
        time_to_send = get_delay_until_five_minutes_before_event(date)
        logging.info(f"Sending sms for {date} in {time_to_send} seconds")
        message = format_message_for_events(events[date])
        schedule_external_sms_sender(message, time_to_send)
    return 'OK'
