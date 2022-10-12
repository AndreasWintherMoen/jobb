from enums import MessageType
from online import get_attendees_for_event
from sms import format_message_for_events, send_sms
from db import Database
import logging
import google.cloud.logging
from utils import subscriber_is_attending_event

def subscriber_should_receive_message(subscriber, event, message_type: MessageType):
    if (message_type == MessageType.REGISTRATION_START):
        # TODO: Once we have a web interface, we should only send SMS to people who have registered for the event
        return True
    elif (message_type == MessageType.UNATTEND or message_type == MessageType.EVENT_START):
        return subscriber_is_attending_event(subscriber, event)
    else:
        print("Message type not supported")
        raise Exception(f"Message type {message_type} not yet supported")

# It may also be possible to do all this logic in one huge MongoDB aggregation pipeline

logging.basicConfig(level=logging.DEBUG, format='[%(asctime)s] %(levelname)s: %(message)s')
gc_logging_client = google.cloud.logging.Client()
gc_logging_client.setup_logging()

def sms_endpoint(data):
    logging.info("********* SMS ENDPOINT CALLED... *********")
    try:
        database = Database()
        database.connect()

        event_ids = data['event_ids']
        message_type = MessageType(data['message_type'])

        subscribers = database.get_all_subscribers() # TODO: Change this to database.get_subscribers_for_events(event_ids)
        events = database.get_events_by_id(event_ids)

        events = [{
            **event,
            'attendees': get_attendees_for_event(event)
        } for event in events]

        subscriber_event_pairs = [{
            'subscriber': subscriber,
            'events': [event for event in events if subscriber_should_receive_message(subscriber, event, message_type)]
        } for subscriber in subscribers]

        subscriber_event_pairs = [pair for pair in subscriber_event_pairs if len(pair['events']) > 0]

        for subscriber_event_pair in subscriber_event_pairs:
            subscriber = subscriber_event_pair['subscriber']
            events = subscriber_event_pair['events']
            message = format_message_for_events(events, message_type)
            send_sms(message, subscriber['phone_number'])
        
        return 'OK'
    except Exception as e:
        logging.error(e)
        return "Error sending SMS. See logs for info"
