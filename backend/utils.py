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
    delay = (run_at - now).total_seconds()
    return delay

def get_current_date():
    return datetime.now(timezone)