import threading
import time
from online import get_event_list, event_is_in_the_future, add_registration_start_to_event
from db import Database
from sms import format_message_for_events, send_multiple_sms
from dotenv import load_dotenv
from datetime import datetime, timedelta
from utils import get_delay_until_five_minutes_before_event, timezone
from api import api
import logging

logging.basicConfig(level=logging.DEBUG, format='[%(asctime)s] %(levelname)s: %(message)s')

load_dotenv()

def is_relevant_event(event, db):
    logging.info(f"Analyzing event [{event['id']}] {event['title']}...")
    if event['is_attendance_event'] == False:
        return False
    if not event_is_in_the_future(event['id']):
        return False
    if db.event_exists_in_database(event['id']):
        return False
    return True

def discover_new_bedpres_and_add_to_database():
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
    database.add_events_to_database(events)
    database.disconnect()

def send_sms_to_subscribed_users(message):
    database = Database()
    database.connect()
    subscribers = database.get_all_subscribers()
    phone_numbers = [subscriber['phone_number'] for subscriber in subscribers]
    send_multiple_sms(message, phone_numbers)
    database.disconnect()

def schedule_sms_for_todays_events():
    logging.info('Scheduling SMS for today...')
    database = Database()
    database.connect()
    events = database.get_todays_events_from_database()
    database.disconnect()
    logging.info(f"Found {len(events)} events")
    for date in events:
        time_to_send = get_delay_until_five_minutes_before_event(date)
        logging.info(f"Sending sms for {date} in {time_to_send} seconds")
        message = format_message_for_events(events[date])
        threading.Timer(time_to_send, send_sms_to_subscribed_users, [message]).start()
    
def run_daily_update():
    logging.info('Performing daily update...')
    discover_new_bedpres_and_add_to_database()
    time.sleep(2)
    schedule_sms_for_todays_events()
    threading.Timer(24*60*60, run_daily_update).start()

if __name__ == '__main__':
    logging.info("Starting bedpres bot...")
    run_daily_update()
