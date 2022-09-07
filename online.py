from requests import get
from utils import date_is_in_the_future

def get_event_list():
    response = get('https://old.online.ntnu.no/api/v1/event/events/?format=json&event_end__gte=2022-09-07&page_size=50')
    data = response.json()
    return data['results']

def event_is_in_the_future(event_id):
    try:
        response = get(f'https://old.online.ntnu.no/api/v1/event/attendance-events/{event_id}/?format=json')
        data = response.json()
        registration_start = data['registration_start']
        return registration_start is not None and date_is_in_the_future(registration_start)
    except:
        return False

