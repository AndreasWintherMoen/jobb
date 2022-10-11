from flask import Flask, request
from twilio.twiml.messaging_response import MessagingResponse
from db import Database
from dotenv import load_dotenv
import logging

load_dotenv()

api = Flask(__name__)
api.debug = False

logging.basicConfig(level=logging.DEBUG, format='[%(asctime)s] %(levelname)s: %(message)s')

@api.route('/jobb/ping', methods=['GET'])
def ping():
    logging.info('Ping endpoint hit')
    return 'pong'

@api.route('/jobb/sms', methods=['POST'])
def sms():
    logging.info('SMS endpoint hit')
    number = request.form['From']
    message = request.form['Body']
    formatted_message = message.lower().strip()

    if formatted_message == 'online':
        logging.info(f"New subscriber: {number}")
        add_subscriber(number)
        response = MessagingResponse()
        response.message(f"Du er nå abonnert på bedpres-oppdateringer! Send OFFLINE hvis du ikke lenger vil ha oppdateringer.")
        return str(response)
    elif formatted_message in ['avslutt', 'offline']:
        logging.info(f"Removed subscriber: {number}")
        remove_subscriber(number)
        response = MessagingResponse()
        response.message(f"Du er nå avmeldt bedpres-oppdateringer.")
        return str(response)
    else:
        logging.debug(f"Unknown message from {number}: {message}")
        response = MessagingResponse()
        response.message(f"Ukjent kommando. Send ONLINE for å abonnere, og OFFLINE for å avslutte abonnementet.")
        return str(response)

def add_subscriber(number):
    database = Database()
    database.connect()
    database.add_subscriber(number)
    database.disconnect()

def remove_subscriber(number):
    database = Database()
    database.connect()
    database.remove_subscriber(number)
    database.disconnect()

if __name__ == '__main__':
    api.run()
