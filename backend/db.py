from typing import Dict, List, Optional, cast
from pymongo import MongoClient
import os
from datetime import datetime, timedelta
import pytz # type: ignore
import logging
from config.types import Ad, Event, OWData, Subscriber, event_notification_field
from utils import format_phone_number

timezone = pytz.timezone('Europe/Oslo')

date_to_events = Dict[event_notification_field, List[Event]]

class Database:
    def __init__(self):
        self.db_uri = os.environ.get('MONGO_URI')
        logging.info(f"initializing database at URI {self.db_uri}...")
        self.db_client = None
        self.db = None
        self.is_connected = False

    def __combine_events_with_same_date(self, events: List[Event], date_field: event_notification_field) -> date_to_events:
        d2e: date_to_events = {}
        for event in events:
            date = cast(event_notification_field, event[date_field])
            if date not in d2e:
                d2e[date] = []
            d2e[date].append(event)
        return d2e

    def __get_todays_events_from_database(self, search_field: event_notification_field) -> date_to_events:
        if not self.is_connected:
            logging.warning("not connected to database")
            return {}
        collection = self.db["events"]
        current_time = datetime.now(timezone)
        tomorrow = current_time + timedelta(days=1)
        date_format = "%Y-%m-%dT%H:%M:%S%z"
        events = collection.find({
            search_field: {
                "$gte": current_time.strftime(date_format),
                "$lt": tomorrow.strftime(date_format)
            }
        })
        return self.__combine_events_with_same_date(events, search_field)

    def connect(self) -> None:
        self.db_client = MongoClient(self.db_uri)
        self.db = self.db_client['JOBB']
        self.is_connected = True
        logging.info("connected to database")

    def disconnect(self) -> None:
        self.db_client.close
        self.db = None
        self.is_connected = False
        logging.info("disconnected from database")

    def event_exists_in_database(self, event_id: int) -> bool:
        if not self.is_connected:
            logging.warning("not connected to database")
            return False
        collection = self.db["events"]
        return collection.find_one({"id": event_id}) is not None

    def add_events_to_database(self, events) -> None:
        if not self.is_connected:
            logging.warning("not connected to database")
            return 
        if (len(events) == 0):
            logging.warning("no events to add")
            return
        logging.info(f"adding {len(events)} events to database")
        collection = self.db["events"]
        collection.insert_many(events, ordered=False)

    def update_events_in_database(self, events: List[Event]) -> None:
        if not self.is_connected:
            logging.warning("not connected to database")
            return
        if (len(events) == 0):
            logging.warning("no events to update")
            return
        logging.info(f"updating {len(events)} events in database")
        collection = self.db["events"]
        for event in events:
            collection.replace_one({"id": event["id"]}, event)

    def get_all_events_from_database(self) -> List[Event]:
        if not self.is_connected:
            logging.warning("not connected to database")
            return []
        collection = self.db["events"]
        return list(collection.find())

    def get_events_by_id(self, event_ids: List[int]) -> List[Event]:
        if not self.is_connected:
            logging.warning("not connected to database")
            return []
        collection = self.db["events"]
        return list(collection.find({"id": {"$in": event_ids}}))

    def get_todays_register_events_from_database(self) -> date_to_events:
        return self.__get_todays_events_from_database("registration_start")

    def get_todays_unattend_events_from_database(self) -> date_to_events:
        return self.__get_todays_events_from_database("unattend_deadline")

    def get_todays_start_events_from_database(self) -> date_to_events:
        return self.__get_todays_events_from_database("start_date")

    def get_all_subscribers(self) -> List[Subscriber]:
        if not self.is_connected:
            logging.warning("not connected to database")
            return []
        collection = self.db["subscribers"]
        return list(collection.find())

    def get_subscribers_for_ads(self) -> List[Subscriber]:
        if not self.is_connected:
            logging.warning("not connected to database")
            return []
        collection = self.db["subscribers"]
        return list(collection.find({"should_receive_ads": True}))

    def add_subscriber(self, subscriber: Subscriber) -> bool:
        if not self.is_connected:
            logging.warning("not connected to database")
            return False
        collection = self.db["subscribers"]
        response = collection.update_one(
            {"phone_number": subscriber["phone_number"]}, 
            { "$set": subscriber }, 
            upsert=True
        )
        return response.matched_count == 0

    def remove_subscriber(self, phone_number) -> bool:
        if not self.is_connected:
            logging.warning("not connected to database")
            return False
        collection = self.db["subscribers"]
        response = collection.delete_one({"phone_number": phone_number})
        return response.deleted_count > 0

    # TODO: see if we can put all this logic in a single MongoDB query, i.e. format the OW phone number in the query
    def get_ow_data_for_phone_number(self, phone_number: str) -> Optional[OWData]:
        if not self.is_connected:
            logging.warning("not connected to database")
            return None
        collection = self.db["ow_users"]
        query = { 
            "phone_number": { "$ne": None }, 
            "username": { "$ne": None } 
        }
        ow_users = list(collection.find(query))
        for user in ow_users:
            ow_phone_number = user["phone_number"]
            if not ow_phone_number:
                continue
            formatted_phone_number = format_phone_number(ow_phone_number)
            if formatted_phone_number == phone_number:
                return user
        return None

    def add_ow_users(self, ow_users: List[OWData]) -> None:
        if not self.is_connected:
            logging.warning("not connected to database")
            return
        if (len(ow_users) == 0):
            logging.warning("no ow users to add")
            return
        logging.info(f"adding {len(ow_users)} ow users to database")
        collection = self.db["ow_users"]
        collection.insert_many(ow_users, ordered=False)

    def get_active_ads(self) -> List[Ad]:
        if not self.is_connected:
            logging.warning("not connected to database")
            return []
        collection = self.db["ads"]
        return list(collection.find({ "is_active": True }).sort("priority_order", 1))

    def add_new_ad_received(self, ad_key: str, subscriber: Subscriber) -> None:
        if not self.is_connected:
            logging.warning("not connected to database")
            return
        collection = self.db["subscribers"]
        collection.update_one(
            {"_id": subscriber["_id"]},
            { "$push": { "ads_received": ad_key } }
        )
