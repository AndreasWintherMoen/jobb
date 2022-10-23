import os
from typing import Literal, cast

if ('ENVIRONMENT' not in os.environ):
    from dotenv import load_dotenv
    load_dotenv()

environment_type = Literal['dev', 'prod_gc', 'prod_api']
ENVIRONMENT = os.environ.get('ENVIRONMENT', 'dev')
if (ENVIRONMENT not in ['dev', 'prod_gc', 'prod_api']):
    raise Exception(f'Invalid environment type: {ENVIRONMENT}. Must be one of: dev, prod_gc, prod_api')
ENVIRONMENT = cast(environment_type, ENVIRONMENT)

MONGO_URI = os.environ.get('MONGO_URI')
OW_COOKIE = os.environ.get('OW_COOKIE')
TWILIO_ACCOUNT_SID = os.environ.get('TWILIO_ACCOUNT_SID')
TWILIO_AUTH_TOKEN = os.environ.get('TWILIO_AUTH_TOKEN')
TWILIO_MESSAGING_SERVICE_SID = os.environ.get('TWILIO_MESSAGING_SERVICE_SID')
SCHEDULER_PROJECT_ID = os.environ.get('GC_PROJECT_ID')
SCHEDULER_QUEUE = os.environ.get('GC_QUEUE')
SCHEDULER_LOCATION = os.environ.get('GC_LOCATION')
SERVICE_ACCOUNT_EMAIL = os.environ.get('SERVICE_ACCOUNT_EMAIL')
SMS_SEND_URL = os.environ.get('SMS_SEND_URL')