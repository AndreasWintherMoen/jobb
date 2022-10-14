from flask import Flask, request
from twilio.twiml.messaging_response import MessagingResponse
from db import Database
from dotenv import load_dotenv
import logging

load_dotenv()

api = Flask(__name__)
api.debug = False

logging.basicConfig(level=logging.DEBUG, format="[%(asctime)s] %(levelname)s: %(message)s")

<<<<<<< HEAD
@api.route("/jobb/ping", methods=["GET"])
=======
database = Database()
database.connect()

@api.route('/jobb/ping', methods=['GET'])
>>>>>>> origin/master
def ping():
    logging.info("Ping endpoint hit")
    return "pong"

@api.route("/jobb/sms", methods=["POST"])
def sms():
    logging.info("SMS endpoint hit")
    number = request.form["From"]
    message = request.form["Body"]
    formatted_message = message.lower().strip()

    if formatted_message == "online":
        logging.info(f"New subscriber: {number}")
        if add_subscriber(number):
            response = MessagingResponse()
            response.message("Du er nå abonnert på bedpres-oppdateringer! Send OFFLINE hvis du ikke lenger vil ha oppdateringer.")
            return str(response)
        response = MessagingResponse()
        response.message("Fant allerede et abonnement på ditt nummer. Send OFFLINE hvis du ikke lenger vil ha oppdateringer.")
        return str(response)
    elif formatted_message in ["avslutt", "offline"]:
        logging.info(f"Removed subscriber: {number}")
        if remove_subscriber(number):
            response = MessagingResponse()
            response.message("Du er nå avmeldt bedpres-oppdateringer.")
            return str(response)
        response = MessagingResponse()
        response.message("Du er ikke abonnert. Skriv ONLINE for å abonnere på bedpres-oppdateringer.")
        return str(response)
    else:
        logging.debug(f"Unknown message from {number}: {message}")
        response = MessagingResponse()
        response.message("Ukjent kommando. Send ONLINE for å abonnere, og OFFLINE for å avslutte abonnementet.")
        return str(response)

def add_subscriber(number):
    if not database.is_connected:
        database.connect()
    did_subscribe = database.add_subscriber(number)
    return did_subscribe

def remove_subscriber(number):
    if not database.is_connected:
        database.connect()
    did_unsubscribe = database.remove_subscriber(number)
    return did_unsubscribe

if __name__ == "__main__":
    api.run()
