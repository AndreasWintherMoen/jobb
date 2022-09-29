from sms import send_multiple_sms
from db import Database
import logging
import google.cloud.logging

logging.basicConfig(level=logging.DEBUG, format='[%(asctime)s] %(levelname)s: %(message)s')
gc_logging_client = google.cloud.logging.Client()
gc_logging_client.setup_logging()

def sms_endpoint(data):
    logging.info("********* SMS ENDPOINT CALLED... *********")
    try:
        message = data.json["message"]
        database = Database()
        database.connect()
        phone_numbers = [subscriber['phone_number'] for subscriber in database.get_all_subscribers()]
        database.disconnect()
        send_multiple_sms(message, phone_numbers)
        return f"Message successfully sent to {len(phone_numbers)} phone numbers"
    except Exception as e:
        logging.error(e)
        return "Error sending SMS. See logs for info"
