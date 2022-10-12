from twilio.rest import Client 
import os
import logging

from enums import MessageType

account_sid = os.environ.get('TWILIO_ACCOUNT_SID')
auth_token = os.environ.get('TWILIO_AUTH_TOKEN')
messaging_service_sid = os.environ.get('TWILIO_MESSAGING_SERVICE_SID')
sender = 'Bedpres Bot'

def __stringify_event_list(events):
    titles = [event['title'] for event in events]
    if (len(titles) == 1):
        return f"'{titles[0]}'"
    elif (len(titles) == 2):
        return f"'{titles[0]}' og '{titles[1]}'"
    else:
        return "'" + f"', '".join(titles[:-1]) + f" og '{titles[-1]}'"

def __format_registration_start_message_for_events(events):
    formatted_titles = __stringify_event_list(events)
    return f"Påmelding til {formatted_titles} åpner om 5 minutter"

def __format_unattend_message_for_events(events):
    formatted_titles = __stringify_event_list(events)
    return f"Frist for avmelding til {formatted_titles} er om 1 time"

def __format_event_start_message_for_events(events):
    formatted_titles = __stringify_event_list(events)
    return f"{formatted_titles} starter om 1 time"

def format_message_for_events(events, message_type):
    if (message_type == MessageType.REGISTRATION_START):
        return __format_registration_start_message_for_events(events)
    elif (message_type == MessageType.UNATTEND):
        return __format_unattend_message_for_events(events)
    elif (message_type == MessageType.EVENT_START):
        return __format_event_start_message_for_events(events)
    else:
        return f"message type {message_type} not supported"

def send_sms(message, phone_number):
    client = Client(account_sid, auth_token)
    confirmation = client.messages.create(
        to=phone_number,
        from_=sender,
        body=message,
        messaging_service_sid=messaging_service_sid,
    )
    logging.info(f"Sent sms to {phone_number} with confirmation code {confirmation.sid}. Message: {message}")

def send_multiple_sms(message, phone_numbers):
    for phone_number in phone_numbers:
        send_sms(message, phone_number)
