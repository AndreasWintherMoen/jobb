from pymongo import MongoClient
import os
from datetime import datetime, timedelta
import pytz
import logging
from utils import format_phone_number

timezone = pytz.timezone('Europe/Oslo')


class Database:
    def __init__(self):
        self.db_uri = os.environ.get('MONGO_URI')
        logging.info(f"initializing database at URI {self.db_uri}...")
        self.db_client = None
        self.db = None
        self.is_connected = False

    def connect(self):
        self.db_client = MongoClient(self.db_uri)
        self.db = self.db_client['JOBB']
        self.is_connected = True
        logging.info("connected to database")

    def disconnect(self):
        self.db_client.close
        self.db = None
        self.is_connected = False
        logging.info("disconnected from database")

    def event_exists_in_database(self, event_id):
        if not self.is_connected:
            logging.warning("not connected to database")
            return False
        collection = self.db["events"]
        return collection.find_one({"id": event_id}) is not None

    def add_events_to_database(self, events):
        if not self.is_connected:
            logging.warning("not connected to database")
            return 
        if (len(events) == 0):
            logging.warning("no events to add")
            return
        logging.info(f"adding {len(events)} events to database")
        collection = self.db["events"]
        collection.insert_many(events, ordered=False)

    def update_events_in_database(self, events):
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

    def get_all_events_from_database(self):
        if not self.is_connected:
            logging.warning("not connected to database")
            return []
        collection = self.db["events"]
        return list(collection.find())

    def get_todays_events_from_database(self):
        if not self.is_connected:
            logging.warning("not connected to database")
            return []
        collection = self.db["events"]
        current_time = datetime.now(timezone)
        tomorrow = current_time + timedelta(days=1)
        date_format = "%Y-%m-%dT%H:%M:%S%z"
        events = collection.find({
            "registration_start": {
                "$gte": current_time.strftime(date_format),
                "$lt": tomorrow.strftime(date_format)
            }
        })
        events = [{"registration_start": event["registration_start"], "title": event["title"]} for event in events]
        date_to_events = {}
        for event in events:
            date = event['registration_start']
            if date not in date_to_events:
                date_to_events[date] = []
            date_to_events[date].append(event)
        return date_to_events

    def get_all_subscribers(self):
        if not self.is_connected:
            logging.warning("not connected to database")
            return []
        collection = self.db["subscribers"]
        return list(collection.find())

    def add_subscriber(self, phone_number) -> bool:
        if not self.is_connected:
            logging.warning("not connected to database")
            return 0
        collection = self.db["subscribers"]
        response = collection.update_one({"phone_number": phone_number}, {"upsert": True})

        return response.modifiedCount == 1

    def remove_subscriber(self, phone_number):
        if not self.is_connected:
            logging.warning("not connected to database")
            return
        collection = self.db["subscribers"]
        collection.delete_one({"phone_number": phone_number})

    def merge_ow_users_and_subscribers(self):
        '''
            Adds OW data to subscribers with no current OW data
        '''
        if not self.is_connected:
            logging.warning("not connected to database")
            return
        sub_collection = self.db["subscribers"]
        subscribers = list(sub_collection.find({ "ow": { "$exists": False }}))
        ow_collection = self.db["ow_users"]
        ow_find_query = { 
            "phone_number": { "$ne": None }, 
            "username": { "$ne": None } 
        }
        ow_users = list(ow_collection.find(ow_find_query).sort("started_date", -1))
        for subscriber in subscribers:
            phone_number = subscriber["phone_number"]
            for ow_user in ow_users:
                ow_phone_number = ow_user["phone_number"]
                if not ow_phone_number:
                    continue
                ow_phone_number = format_phone_number(ow_phone_number)
                if phone_number == ow_phone_number:
                    subscriber["ow"] = ow_user
                    sub_collection.replace_one({"phone_number": phone_number}, subscriber)
                    break

