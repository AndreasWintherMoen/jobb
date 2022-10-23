import datetime
import json
from typing import Any
from google.cloud import tasks_v2
from google.protobuf import duration_pb2, timestamp_pb2 # type: ignore
import logging
from config.env import SCHEDULER_LOCATION, SCHEDULER_PROJECT_ID, SCHEDULER_QUEUE, SERVICE_ACCOUNT_EMAIL, SMS_SEND_URL

from enums import MessageType

client = tasks_v2.CloudTasksClient()

project = SCHEDULER_PROJECT_ID
queue = SCHEDULER_QUEUE
location = SCHEDULER_LOCATION
service_account_email = SERVICE_ACCOUNT_EMAIL
url = SMS_SEND_URL

if not project or not queue or not location or not service_account_email or not url:
    raise ValueError("Missing environment variables")

parent = client.queue_path(project, location, queue)

def schedule_external_sms_sender(event_ids: list[int], message_type: MessageType, time_to_send: int) -> Any:
    logging.info("schedule_external_sms_sender...")
    payload: Any = { 'event_ids': event_ids, 'message_type': message_type.value }
    payload = json.dumps(payload)
    converted_payload = payload.encode()
    d = datetime.datetime.utcnow() + datetime.timedelta(seconds=time_to_send)

    timestamp = timestamp_pb2.Timestamp()
    timestamp.FromDatetime(d)
    duration = duration_pb2.Duration()
    duration.FromSeconds(600)

    task = {
        "http_request": {
            "http_method": tasks_v2.HttpMethod.POST,
            "url": url,
            "headers": {"Content-type": "application/json"},
            "body": converted_payload,
            "oidc_token": {
                "service_account_email": service_account_email,
                "audience": url,
            },
        },
        "schedule_time": timestamp,
        "dispatch_deadline": duration
    }

    response = client.create_task(request={"parent": parent, "task": task})

    return response
