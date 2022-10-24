from typing import List, Sequence
from twilio.rest import Client 
from config.env import TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_MESSAGING_SERVICE_SID
import logger
from enums import MessageType
from config.types import Event

account_sid = TWILIO_ACCOUNT_SID
auth_token = TWILIO_AUTH_TOKEN
messaging_service_sid = TWILIO_MESSAGING_SERVICE_SID
sender = 'Bedpres Bot'


def __stringify_event_list(events: Sequence[Event]) -> List[str]:
    return [event['title'] for event in events]


def __list_events_as_string(events: Sequence[str]) -> str:
    return ' - ' + '\n - '.join(events)


def __format_registration_start_message_for_events(events: Sequence[Event]) -> str:
    formatted_titles = __stringify_event_list(events)
    titles_as_bulletin = __list_events_as_string(formatted_titles)
    return f"Påmelding åpner om 5 minutter til:\n{titles_as_bulletin}"


def __format_unattend_message_for_events(events: Sequence[Event]) -> str:
    formatted_titles = __stringify_event_list(events)
    titles_as_bulletin = __list_events_as_string(formatted_titles)
    return f"Avmeldingsfrist om 1 time til:\n{titles_as_bulletin}"


def __format_event_start_message_for_events(events: Sequence[Event]) -> str:
    formatted_titles = __stringify_event_list(events)
    titles_as_bulletin = __list_events_as_string(formatted_titles)
    return f"Om 1 time starter:\n{titles_as_bulletin}"


def format_message_for_events(events: Sequence[Event], message_type: MessageType) -> str:
    if (message_type == MessageType.REGISTRATION_START):
        return __format_registration_start_message_for_events(events)
    elif (message_type == MessageType.UNATTEND):
        return __format_unattend_message_for_events(events)
    elif (message_type == MessageType.EVENT_START):
        return __format_event_start_message_for_events(events)
    else:
        return f"message type {message_type} not supported"

def send_sms(message: str, phone_number: str) -> None:
    client = Client(account_sid, auth_token)
    confirmation = client.messages.create(
        to=phone_number,
        from_=sender,
        body=message,
        messaging_service_sid=messaging_service_sid,
    )
    logger.info(
        f"Sent sms to {phone_number} with confirmation code {confirmation.sid}. Message: {message}")


def send_multiple_sms(message: str, phone_numbers: List[str]) -> None:
    for phone_number in phone_numbers:
        send_sms(message, phone_number)
