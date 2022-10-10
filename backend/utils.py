from datetime import datetime, timedelta
import pytz

timezone = pytz.timezone('Europe/Oslo')

def date_is_in_the_future(date):
    formatted_date = datetime.fromisoformat(date)
    current_date = datetime.now(timezone)
    return formatted_date > current_date

def get_delay_until_five_minutes_before_event(date):
    now = datetime.now(timezone)
    event_time = now.strptime(date, "%Y-%m-%dT%H:%M:%S%z")
    run_at = event_time - timedelta(minutes=5)
    delay = int((run_at - now).total_seconds())
    return delay

def format_message_for_events(events):
    titles = [event['title'] for event in events]
    formatted_titles = ''
    if (len(titles) == 1):
        formatted_titles = f"'{titles[0]}'"
    elif (len(titles) == 2):
        formatted_titles = f"'{titles[0]}' og '{titles[1]}'"
    else:
        formatted_titles = "'" + f"', '".join(titles[:-1]) + f" og '{titles[-1]}'"
    return f"Påmelding til {formatted_titles} åpner om 5 minutter"

def get_current_date():
    return datetime.now(timezone)

def format_phone_number(phone_number):
    phone_number = phone_number.replace(' ', '')
    if phone_number[0] == '+':
        return phone_number
    return f'+47{phone_number}'
