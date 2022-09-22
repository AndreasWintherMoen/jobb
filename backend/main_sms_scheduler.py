from db import Database
from sms import format_message_for_events, send_multiple_sms
from utils import get_delay_until_five_minutes_before_event, timezone
import logging
import google.cloud.logging

logging.basicConfig(level=logging.DEBUG, format='[%(asctime)s] %(levelname)s: %(message)s')
gc_logging_client = google.cloud.logging.Client()
gc_logging_client.setup_logging()

def send_sms_to_subscribed_users(message):
    database = Database()
    database.connect()
    subscribers = database.get_all_subscribers()
    phone_numbers = [subscriber['phone_number'] for subscriber in subscribers]
    send_multiple_sms(message, phone_numbers)
    database.disconnect()

def schedule_sms_for_todays_events(data, context):
    logging.info("********* STARTING SMS SCEDULER... *********")
    logging.info('Scheduling SMS for today...')
    database = Database()
    database.connect()
    events = database.get_todays_events_from_database()
    logging.info(f"Found {len(events)} events")
    database.disconnect()
    for date in events:
        time_to_send = get_delay_until_five_minutes_before_event(date)
        logging.info(f"Sending sms for {date} in {time_to_send} seconds")
        message = format_message_for_events(events[date])
        # TODO: Schedule this with Google Cloud Scheduler instead
        # threading.Timer(time_to_send, send_sms_to_subscribed_users, [message]).start()
