from datetime import datetime
import pytz

timezone = pytz.timezone('Europe/Oslo')

def date_is_in_the_future(date):
    formatted_date = datetime.fromisoformat(date)
    current_date = datetime.now(timezone)
    return formatted_date > current_date
