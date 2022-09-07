from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

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
