from typing import List
from requests import get # type: ignore
from config.env import OW_COOKIE
from utils import date_is_in_the_future, get_current_date
import logger
from config.types import Event, EventAttendee

def __get_auth_headers():
    return {'Cookie': OW_COOKIE}

def get_event_list() -> List[Event]:
    date = get_current_date().date()
    url = f'https://old.online.ntnu.no/api/v1/event/events/?format=json&event_end__gte={date}&page_size=50'
    try:
        response = get(url)
        data = response.json()
        return data['results']
    except:
        logger.error('Failed to fetch events from OW')
        return []

def event_is_in_the_future(event: Event) -> bool:
    try:
        event_id = event['id']
        start_date = event['start_date']
        response = get(f'https://old.online.ntnu.no/api/v1/event/attendance-events/{event_id}/?format=json', timeout=30)
        data = response.json()
        registration_start = data['registration_start']
        if registration_start is None or not date_is_in_the_future(registration_start):
            return False
        if start_date is None or not date_is_in_the_future(start_date):
            return False
        return True
    except:
        logger.error(f'Failed to fetch event {event_id} from OW')
        return False

def add_registration_dates_to_event(event: Event) -> Event:
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
        logger.error(f'Failed to fetch event {event["id"]} from OW')
        return event

def get_attendees_for_event(event: Event) -> List[EventAttendee]:
    url = f'https://old.online.ntnu.no/api/v1/event/attendance-events/{event["id"]}/public-attendees/?format=json'
    try:
        response = get(url, timeout=30, headers=__get_auth_headers())
        users = response.json()
        return users
    except:
        logger.error(f'Failed to fetch event {event["id"]} from OW')
        return []
