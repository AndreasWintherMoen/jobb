from flask import Flask, request
from twilio.twiml.messaging_response import MessagingResponse
from config.types import Subscriber
from db import Database
import logger

api = Flask(__name__)
api.debug = False

default_subscriber = {
    "ads_received": [],
    "should_receive_ads": True,
}

database = Database()
database.connect()

@api.route('/jobb/ping', methods=['GET'])
def ping() -> str:
    logger.info("Ping endpoint hit")
    return "pong"

@api.route("/jobb/sms", methods=["POST"])
def sms() -> str:
    logger.info("SMS endpoint hit")
    phone_number = request.form["From"]
    message = request.form["Body"]
    response_message = evaluate_user_message(phone_number, message)
    response = MessagingResponse()
    response.message(response_message)
    return str(response)

def handle_subscribe(phone_number: str) -> str:
    logger.info(f"New subscriber: {phone_number}")
    new_subscriber = map_phone_number_to_subscriber(phone_number)
    successfully_added = add_subscriber(new_subscriber)
    if successfully_added:
        return "Du er nå abonnert på bedpres-oppdateringer! Send OFFLINE hvis du ikke lenger vil ha oppdateringer."
    else:
        return "Du er allerede abonnert på bedpres-oppdateringer. Send OFFLINE hvis du ikke lenger vil ha oppdateringer."

def handle_unsubscribe(phone_number: str) -> str:
    logger.info(f"Removed subscriber: {phone_number}")
    successfully_removed = remove_subscriber(phone_number)
    if successfully_removed:
        return "Du er nå avmeldt bedpres-oppdateringer."
    else:
        return "Du er ikke abonnert. Skriv ONLINE for å abonnere på bedpres-oppdateringer."

def handle_unknown_command(phone_number: str, user_message: str) -> str:
    logger.debug(f"Unknown message from {phone_number}: {user_message}")
    return "Ukjent kommando. Send ONLINE for å abonnere, og OFFLINE for å avslutte abonnementet."

def evaluate_user_message(phone_number: str, user_message: str) -> str:
    formatted_message = user_message.lower().strip()
    if formatted_message == "online":
        return handle_subscribe(phone_number)
    elif formatted_message in ["avslutt", "offline"]:
        return handle_unsubscribe(phone_number)
    else:
        return handle_unknown_command(phone_number, user_message)


def map_phone_number_to_subscriber(phone_number: str) -> Subscriber:
    if not database.is_connected:
        database.connect()
    ow_data = database.get_ow_data_for_phone_number(phone_number)
    return {
        **default_subscriber, # type: ignore
        'phone_number': phone_number,
        'ow': ow_data,
    } 

def add_subscriber(subscriber: Subscriber) -> bool:
    if not database.is_connected:
        database.connect()
    phone_number = subscriber['phone_number']
    if database.subscriber_exists(phone_number):
        return False
    if database.subscriber_exists(phone_number, True):
        return database.re_activate_subscriber(phone_number)
    return database.add_subscriber(subscriber)

def remove_subscriber(phone_number: str) -> bool:
    if not database.is_connected:
        database.connect()
    did_unsubscribe = database.remove_subscriber(phone_number)
    return did_unsubscribe

if __name__ == "__main__":
    api.run()
