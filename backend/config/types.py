from typing import List, Literal, Optional
from bson import objectid
from mypy_extensions import TypedDict


class StudentVerv(TypedDict):
    id: int
    committee: str
    position: str
    period: str
    period_start: str
    period_end: str

class StudentSpecialVerv(TypedDict):
    id: int
    since_year: int
    position: str

class PublicProfile(TypedDict):
    id: int
    first_name: str
    last_name: str
    username: str

class EventAttendee(TypedDict):
    id: int
    event: int
    full_name: str
    is_visible: bool
    year_of_study: int
    field_of_study: str

class EventImage(TypedDict):
    id: int
    name: str
    timestamp: str
    description: str
    thumb: str
    original: str
    wide: str
    lg: str
    md: str
    sm: str
    xs: str
    tags: List[str]
    photographer: str
    preset: str
    preset_display: str

class OWData(TypedDict):
    _id: objectid.ObjectId # MongoDB ObjectId
    id: int # OW user ID
    username: str
    nickname: Optional[str]
    first_name: str
    last_name: str
    phone_number: str
    online_mail: Optional[str]
    address: str
    zip_code: str
    email: str
    website: Optional[str]
    github: Optional[str]
    linkedin: Optional[str]
    ntnu_username: Optional[str]
    field_of_study: int
    year: int
    bio: str
    positions: List[StudentVerv]
    special_positions: List[StudentSpecialVerv]
    image: str
    started_date: str


class Subscriber(TypedDict):
    _id: objectid.ObjectId
    phone_number: str
    ow: OWData
    should_receive_ads: bool
    ads_received: List[str]

event_notification_field = Literal[ "registration_start", "unattend_deadline", "start_date" ]

class Event(TypedDict):
    _id: objectid.ObjectId # MongoDB ObjectId
    id: int # OW event ID
    title: str
    slug: str
    ingress: str
    ingress_short: str
    description: str
    start_date: str
    end_date: str
    location: str
    event_type: int
    event_type_display: str
    organizer: int
    author: Optional[PublicProfile]
    images: List[EventImage]
    companies: List[str]
    is_attendance_event: bool
    max_capacity: int
    number_of_seats_taken: int
    registration_start: event_notification_field
    registration_end: event_notification_field
    unattend_deadline: event_notification_field

class EventWithAttendees(Event):
    attendees: List[EventAttendee]

class Ad(TypedDict):
    _id: objectid.ObjectId
    key: str 
    text: str
    is_active: bool
    priority_order: int