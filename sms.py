from twilio.rest import Client 
import os

account_sid = os.environ.get('TWILIO_ACCOUNT_SID')
auth_token = os.environ.get('TWILIO_AUTH_TOKEN')
messaging_service_sid = os.environ.get('TWILIO_MESSAGING_SERVICE_SID')
sender = 'Bedpres Bot'

def format_message_for_events(events):
    titles = [event['title'] for event in events]
    formatted_titles = ''
    if (len(titles) == 1):
        formatted_titles = f"'{titles[0]}'"
    elif (len(titles) == 2):
        formatted_titles = f"'{titles[0]}' og '{titles[1]}'"
    else:
        formatted_titles = "'" + f"', '".join(titles[:-1]) + f" og '{titles[-1]}'"
    return f"Påmelding til {formatted_titles} åpner om 5 minutter"

def send_sms(message, phone_number):
    client = Client(account_sid, auth_token)
    confirmation = client.messages.create(
        to=phone_number,
        from_=sender,
        body=message,
        messaging_service_sid=messaging_service_sid,
    )
    print(f"Sent sms to {phone_number} with confirmation code {confirmation.sid}. Message: {message}")

def send_multiple_sms(message, phone_numbers):
    for phone_number in phone_numbers:
        send_sms(message, phone_number)
