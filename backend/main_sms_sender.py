from typing import List, Tuple
from enums import MessageType
from online import get_attendees_for_event
from sms import format_message_for_events, send_sms
from db import Database
import logging
import google.cloud.logging
from config.types import Event, EventWithAttendees, Subscriber
from utils import subscriber_is_attending_event

SubscriberEventsPair = Tuple[Subscriber, List[EventWithAttendees]]

def subscriber_should_receive_message(subscriber: Subscriber, event: EventWithAttendees, message_type: MessageType) -> bool:
    if (message_type == MessageType.REGISTRATION_START):
        # TODO: Once we have a web interface, we should only send SMS to people who have registered for the event
        return True
    elif (message_type == MessageType.UNATTEND or message_type == MessageType.EVENT_START):
        return subscriber_is_attending_event(subscriber, event)
    else:
        raise Exception(f"Message type {message_type} not yet supported")

def add_attendees_to_event(event: Event) -> EventWithAttendees:
    attendees = get_attendees_for_event(event)
    return {**event, 'attendees': attendees} # type: ignore

logging.basicConfig(level=logging.DEBUG, format='[%(asctime)s] %(levelname)s: %(message)s')
gc_logging_client = google.cloud.logging.Client()
gc_logging_client.setup_logging()

def sms_endpoint(data) -> str:
    logging.info("********* SMS ENDPOINT CALLED... *********")
    try:
        database = Database()
        database.connect()

        event_ids = data.json['event_ids']
        message_type = MessageType(data.json['message_type'])

        subscribers = database.get_all_subscribers() # TODO: Change this to database.get_subscribers_for_events(event_ids)
        events = database.get_events_by_id(event_ids)

        events_with_attendees = [add_attendees_to_event(event) for event in events]

        subscriber_event_pairs: List[SubscriberEventsPair] = [(
            subscriber, 
            [event for event in events_with_attendees if subscriber_should_receive_message(subscriber, event, message_type)])
                for subscriber in subscribers]

        subscriber_event_pairs = [pair for pair in subscriber_event_pairs if len(pair[1]) > 0]

        for subscriber_event_pair in subscriber_event_pairs:
            subscriber = subscriber_event_pair[0]
            sub_events = subscriber_event_pair[1]
            message = format_message_for_events(sub_events, message_type)
            send_sms(message, subscriber['phone_number'])
        
        return 'OK'
    except Exception as e:
        logging.error(e)
        return "Error sending SMS. See logs for info"


