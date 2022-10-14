from sms import send_sms
from db import Database
import logging
import google.cloud.logging

logging.basicConfig(level=logging.DEBUG, format='[%(asctime)s] %(levelname)s: %(message)s')
gc_logging_client = google.cloud.logging.Client()
gc_logging_client.setup_logging()

def subscriber_has_received_ad(subscriber, ad):
    return ad["key"] in subscriber["ads_received"]

def find_ad_for_subscriber(subscriber, ads):
    for ad in ads:
        if not subscriber_has_received_ad(subscriber, ad):
            return ad
    return None

def send_ad(data, context):
    logging.info("********* SENDING ADS... *********")

    database = Database()
    database.connect()

    subscribers = database.get_subscribers_for_ads()
    ads = database.get_active_ads()

    logging.info(f"Found {len(subscribers)} subscribers and {len(ads)} active ads")

    sub_ad_pairs = [{
        "subscriber": sub,
        "ad": find_ad_for_subscriber(sub, ads)
    } for sub in subscribers]

    sub_ad_pairs = [s2a for s2a in sub_ad_pairs if s2a["ad"] is not None]

    logging.info(f"Sending ad to {len(sub_ad_pairs)} subscribers")

    for sub_ad_pair in sub_ad_pairs:
        subscriber = sub_ad_pair["subscriber"]
        ad = sub_ad_pair["ad"]
        send_sms(ad["text"], subscriber["phone_number"])
        database.add_new_ad_received(ad["key"], subscriber)

    database.disconnect()

    return 'OK'
