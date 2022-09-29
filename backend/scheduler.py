import os
import datetime
import json
from google.cloud import tasks_v2
from google.protobuf import duration_pb2, timestamp_pb2
import logging

client = tasks_v2.CloudTasksClient()

project = os.environ.get('GC_PROJECT_ID')
queue = os.environ.get('GC_QUEUE')
location = os.environ.get('GC_LOCATION')
service_account_email = os.environ.get('SERVICE_ACCOUNT_EMAIL')
parent = client.queue_path(project, location, queue)
url = os.environ.get('SMS_SEND_URL')

def schedule_external_sms_sender(message, time_to_send):
    logging.info("schedule_external_sms_sender...")
    payload = { 'message': message }
    payload = json.dumps(payload)
    converted_payload = payload.encode()
    d = datetime.datetime.utcnow() + datetime.timedelta(seconds=time_to_send)

    timestamp = timestamp_pb2.Timestamp()
    timestamp.FromDatetime(d)
    duration = duration_pb2.Duration()
    duration.FromSeconds(time_to_send + 600)

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

    print("Created task {}".format(response.name))
    return response
