from datetime import datetime, timedelta
import pytz
from config.types import EventWithAttendees, Subscriber

timezone = pytz.timezone('Europe/Oslo')

def date_is_in_the_future(date: str) -> bool:
    formatted_date = datetime.fromisoformat(date)
    current_date = datetime.now(timezone)
    return formatted_date > current_date

def get_delay_until_five_minutes_before_event(date: str) -> int:
    now = datetime.now(timezone)
    event_time = now.strptime(date, "%Y-%m-%dT%H:%M:%S%z")
    run_at = event_time - timedelta(minutes=5)
    delay = int((run_at - now).total_seconds())
    return delay

def get_delay_until_one_hour_before_event(date: str) -> int:
    now = datetime.now(timezone)
    event_time = now.strptime(date, "%Y-%m-%dT%H:%M:%S%z")
    run_at = event_time - timedelta(hours=1)
    delay = int((run_at - now).total_seconds())
    return delay

def get_current_date() -> datetime:
    return datetime.now(timezone)

def format_phone_number(phone_number: str) -> str:
    '''Formats phone number to the format +47XXXXXXXX which is required by Twilio.
    This is necessary because the phone numbers from OW are just plain text, and may be written
    in different formats.
    '''
    phone_number = phone_number.replace(' ', '')
    if phone_number[0] == '+':
        return phone_number
    return f'+47{phone_number}'

def format_full_name(subscriber: Subscriber) -> str:
    '''Formats full name same way it's done in OW.
    See get_full_name in https://github.com/dotkom/onlineweb4/blob/main/apps/authentication/models.py
    '''
    ow_data = subscriber["ow"]
    full_name = "%s %s" % (ow_data["first_name"], ow_data["last_name"])
    return full_name.strip()

def subscriber_is_attending_event(subscriber: Subscriber, event: EventWithAttendees) -> bool:
    if "ow" not in subscriber:
        return False
    full_name = format_full_name(subscriber)
    users = event['attendees']
    return full_name in [user["full_name"] for user in users]
