import threading
import time
from online import get_event_list, event_is_in_the_future, add_registration_start_to_event
from db import Database
from sms import format_message_for_events, send_multiple_sms
from dotenv import load_dotenv
from datetime import datetime, timedelta
from utils import get_delay_until_five_minutes_before_event, timezone

load_dotenv()

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
    print("Discovering new bedpres events...")
    events = get_event_list()
    total_count = len(events)
    print(f"Fetched {total_count} events")
    events = [event for event in events if is_relevant_event(event, db)]
    filtered_count = len(events)
    print(f"Filtered {total_count} events to {filtered_count} events")
    events = [add_registration_start_to_event(event) for event in events]
    db.add_events_to_database(events)

def send_sms_to_subscribed_users(message):
    database = Database()
    database.connect()
    subscribers = database.get_all_subscribers()
    phone_numbers = [subscriber['phone'] for subscriber in subscribers]
    send_multiple_sms(message, phone_numbers)
    database.disconnect()

def schedule_sms_for_todays_events(db):
    print('Scheduling SMS for today...')
    events = db.get_todays_events_from_database()
    print(f"Found {len(events)} events")
    for date in events:
        time_to_send = get_delay_until_five_minutes_before_event(date)
        print(f"Sending sms for {date} in {time_to_send} seconds")
        message = format_message_for_events(events[date])
        threading.Timer(time_to_send, send_sms_to_subscribed_users, [message]).start()
    
def run_daily_update():
    print('Performing daily update...')
    database = Database()
    database.connect()
    discover_new_bedpres_and_add_to_database(database)
    time.sleep(2)
    schedule_sms_for_todays_events(database)
    database.disconnect()
    threading.Timer(24*60*60, run_daily_update).start()

if __name__ == '__main__':
    print("Starting bedpres bot...")
    run_daily_update()