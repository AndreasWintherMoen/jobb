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
        if not response.ok:
            logger.error(f'Failed to fetch events from OW. Received status code {response.status_code}')
            return []
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
        if not response.ok:
            logger.error(f'Failed to fetch attendance event {event["id"]} from OW. Received status code {response.status_code}')
            return False
        data = response.json()
        registration_start = data['registration_start']
        if registration_start is not None and date_is_in_the_future(registration_start):
            return True
        if start_date is not None and date_is_in_the_future(start_date):
            return True
        return False
    except:
        logger.error(f'Failed to fetch event {event_id} from OW')
        return False

def add_attendance_event_data_to_event(event: Event) -> Event:
    try:
        response = get(f'https://old.online.ntnu.no/api/v1/event/attendance-events/{event["id"]}/?format=json', timeout=30)
        if not response.ok:
            logger.error(f'Failed to fetch attendance event {event["id"]} from OW. Received status code {response.status_code}')
            return event
        data = response.json()
        registration_start = data['registration_start']
        registration_end = data['registration_end']
        unattend_deadline = data['unattend_deadline']
        number_on_waitlist = data['number_on_waitlist']
        rule_bundles = data['rule_bundles']
        event['registration_start'] = registration_start
        event['registration_end'] = registration_end
        event['unattend_deadline'] = unattend_deadline
        event['number_on_waitlist'] = number_on_waitlist
        event['rule_bundles'] = rule_bundles
        return event
    except:
        logger.error(f'Failed to fetch event {event["id"]} from OW')
        return event

def get_attendees_for_event(event: Event) -> List[EventAttendee]:
    url = f'https://old.online.ntnu.no/api/v1/event/attendance-events/{event["id"]}/public-attendees/?format=json'
    try:
        response = get(url, timeout=30, headers=__get_auth_headers())
        if not response.ok:
            logger.error(f'Failed to fetch attendance event {event["id"]} from OW. Received status code {response.status_code}')
            return []
        users = response.json()
        return users
    except:
        logger.error(f'Failed to fetch event {event["id"]} from OW')
        return []
