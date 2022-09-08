from pymongo import MongoClient
import os
from datetime import datetime, timedelta
import pytz

timezone = pytz.timezone('Europe/Oslo')

class Database:
    def __init__(self):
        self.db_uri = os.environ.get('MONGO_URI')
        self.db_client = None
        self.db = None
        self.is_connected = False

    def connect(self):
        self.db_client = MongoClient(self.db_uri)
        self.db = self.db_client['JOBB']
        self.is_connected = True
        print("connected to database")

    def disconnect(self):
        self.db_client.close
        self.db = None
        self.is_connected = False
        print("disconnected from database")

    def event_exists_in_database(self, event_id):
        if not self.is_connected:
            print("not connected to database")
            return False
        collection = self.db["events"]
        return collection.find_one({"id": event_id}) is not None

    def add_events_to_database(self, events):
        if not self.is_connected:
            print("not connected to database")
            return 
        if (len(events) == 0):
            print("no events to add")
            return
        print(f"adding {len(events)} events to database")
        collection = self.db["events"]
        collection.insert_many(events, ordered=False)

    def get_all_events_from_database(self):
        if not self.is_connected:
            print("not connected to database")
            return []
        collection = self.db["events"]
        return list(collection.find())

    def get_todays_events_from_database(self):
        if not self.is_connected:
            print("not connected to database")
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
            print("not connected to database")
            return []
        collection = self.db["phone-numbers"]
        return list(collection.find())
