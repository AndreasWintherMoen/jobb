from typing import List, Optional, Tuple
from config.types import Ad, Subscriber
from sms import send_sms
from db import Database
import logging
import google.cloud.logging

logging.basicConfig(level=logging.DEBUG, format='[%(asctime)s] %(levelname)s: %(message)s')
gc_logging_client = google.cloud.logging.Client()
gc_logging_client.setup_logging()

SubscriberAdPair = Tuple[Subscriber, Ad]

def subscriber_has_received_ad(subscriber: Subscriber, ad: Ad) -> bool:
    return ad["key"] in subscriber["ads_received"]

def find_ad_for_subscriber(subscriber: Subscriber, ads: List[Ad]) -> Optional[Ad]:
    for ad in ads:
        if not subscriber_has_received_ad(subscriber, ad):
            return ad
    return None

def send_ad(data, context) -> str:
    logging.info("********* SENDING ADS... *********")

    database = Database()
    database.connect()

    subscribers = database.get_subscribers_for_ads()
    ads = database.get_active_ads()

    logging.info(f"Found {len(subscribers)} subscribers and {len(ads)} active ads")

    # Python typing is dumb and doesn't understand that 'if s2a[1] is not None' means the ad is no longer nullable (Optional[Ad]). So we need this temp variable and manually cast it.
    sub_ad_pairs_optionalad = [(subscriber, find_ad_for_subscriber(subscriber, ads)) for subscriber in subscribers]
    sub_ad_pairs: List[SubscriberAdPair] = [s2a for s2a in sub_ad_pairs_optionalad if s2a[1] is not None] # type: ignore

    logging.info(f"Sending ad to {len(sub_ad_pairs)} subscribers")

    for sub_ad_pair in sub_ad_pairs:
        subscriber = sub_ad_pair[0]
        ad = sub_ad_pair[1]
        send_sms(ad["text"], subscriber["phone_number"])
        database.add_new_ad_received(ad["key"], subscriber)

    database.disconnect()

    return 'OK'
