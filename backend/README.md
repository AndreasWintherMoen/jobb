# Backend

## Setup instructions

0. This assumes you have a working Python 3.9+ environment with pip installed.
1. Create a virtual environment: `python3 -m venv env`
2. Activate the virtual environment: `source env/bin/activate`
3. Install the dependencies: `pip3 install -r requirements.txt`
4. Create a .env file. See .env.example for an example.

## File structure

The backend runs on Google Cloud as serverless functions. This is really nice because it means the server costs are literally zero (Google Cloud allows 2 million free requests per month). There are three main files:

- `main_scraper.py` - This retrieves information from OW about new events. I initially named it scraper because I thought I had to scrape the OW website, but OW's API is fully open so we just send web requests to the API instead. However, I have used the term _scraper_ throughout and never bothererd changing it. In Google Cloud, this is a scheduled cron function that runs every night at 3am.
- `main_sms_sender.py` - This sends out a given message as SMS to all subscribers. This is an HTTP triggered event in Google Cloud, i.e. it is manually triggered by an authenticated web request. Google Cloud's HTTP functions are based on Flask.
- `main_sms_scheduler.py` - This checks whether there are events with registration_start in the next 24 hours and if so, schedules an SMS sender task 5 minutes before registration_start. In Google Cloud, this is a scheduled cron function that runs every night at 3:30am.
- `main_ad_manager.py` - This retrieves all subscribers who are supposed to receive ads (there is a boolean field _should_receive_ads_ in the users database) and finds a suitable ad based on a priority list. Then, it sends an SMS to all the users whom has a suitable ad. The script is a scheduled cron function which runs the 15th of every month.

Additionally, there's a main function called `api.py` which is a very simple Flask server that I run on a Linode server instead of a serverless Google Cloud function. The server listens to incoming subscribe/unsubscribe SMS, and updates the database accordingly. When the frontend is fully implemented it will handle new signups, and this server file can be removed.

The rest of the files are helper functions and classes. They should be named quite self-explanatory.
