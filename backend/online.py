from requests import get
from utils import date_is_in_the_future
import logging

def get_event_list():
    try:
        response = get('https://old.online.ntnu.no/api/v1/event/events/?format=json&event_end__gte=2022-09-07&page_size=50', timeout=30)
        data = response.json()
        return data['results']
    except:
        logging.error('Failed to fetch events from OW')
        return []

def event_is_in_the_future(event_id):
    try:
        response = get(f'https://old.online.ntnu.no/api/v1/event/attendance-events/{event_id}/?format=json', timeout=30)
        data = response.json()
        registration_start = data['registration_start']
        return registration_start is not None and date_is_in_the_future(registration_start)
    except:
        logging.error(f'Failed to fetch event {event_id} from OW')
        return False

def add_registration_dates_to_event(event):
    try:
        response = get(f'https://old.online.ntnu.no/api/v1/event/attendance-events/{event["id"]}/?format=json', timeout=30)
        data = response.json()
        registration_start = data['registration_start']
        registration_end = data['registration_end']
        unattend_deadline = data['unattend_deadline']
        event['registration_start'] = registration_start
        event['registration_end'] = registration_end
        event['unattend_deadline'] = unattend_deadline
        return event
    except:
        logging.error(f'Failed to fetch event {event["id"]} from OW')
        return event
